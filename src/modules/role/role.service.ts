// Core
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PopulateOptions, Types } from 'mongoose'
// DTOs
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto'
import { UpdateRoleDto } from '@/modules/role/dto/update-role.dto'
import { AddPermissionsDto } from '@/modules/role/dto/add-permissions.dto'
import { RemovePermissionsDto } from '@/modules/role/dto/remove-permissions.dto'
// Schemas
import {
    Role,
    RoleDocument,
    RolePermission,
    PopulatedRoleDocument,
} from '@/modules/role/schemas/role.schema'
import { PermissionDocument } from '@/modules/permission/schemas/permission.schema'
// Services
import { PermissionService } from '@/modules/permission/permission.service'

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
        private readonly permissionService: PermissionService
    ) {}

    // Helpers
    private getStandardPopulate(): PopulateOptions {
        return {
            path: 'permissions.permissionId',
            select: 'permissionKey',
        }
    }

    private mapToPopulatedRole(
        roleDoc: RoleDocument | null
    ): PopulatedRoleDocument | null {
        if (!roleDoc) return null

        const roleObj = roleDoc.toJSON()

        const typedPermissions = roleObj.permissions as unknown as Array<{
            permissionId: PermissionDocument
            canRead: boolean
            canWrite: boolean
        }>

        const mappedPermissions = typedPermissions.map((p) => ({
            permission: p.permissionId,
            canRead: p.canRead,
            canWrite: p.canWrite,
        }))

        return {
            ...roleObj,
            permissions: mappedPermissions,
        } as unknown as PopulatedRoleDocument
    }

    private async validatePermissionsExists(
        permissions: { permissionId: string }[]
    ): Promise<void> {
        for (const item of permissions) {
            const exists = await this.permissionService.findOne(
                item.permissionId
            )
            if (!exists) {
                throw new BadRequestException(
                    `Permission ID "${item.permissionId}" does not exist`
                )
            }
        }
    }

    // POST /roles
    async create(createRoleDto: CreateRoleDto): Promise<PopulatedRoleDocument> {
        let permissionsData: RolePermission[] = []

        if (createRoleDto.permissions && createRoleDto.permissions.length > 0) {
            await this.validatePermissionsExists(createRoleDto.permissions)

            permissionsData = createRoleDto.permissions.map((p) => ({
                permissionId: new Types.ObjectId(p.permissionId),
                canRead: p.canRead,
                canWrite: p.canWrite,
            }))
        }

        const createdRole = new this.roleModel({
            ...createRoleDto,
            permissions: permissionsData,
        })

        const savedRole = await createdRole.save()
        const populated = await savedRole.populate(this.getStandardPopulate())
        return this.mapToPopulatedRole(populated) as PopulatedRoleDocument
    }

    // GET /roles
    async findAll(): Promise<PopulatedRoleDocument[]> {
        const roles = await this.roleModel
            .find()
            .populate(this.getStandardPopulate())
            .exec()

        return roles
            .map((role) => this.mapToPopulatedRole(role))
            .filter((role): role is PopulatedRoleDocument => role !== null)
    }

    // GET /roles/:id
    async findOne(id: string): Promise<PopulatedRoleDocument | null> {
        const role = await this.roleModel
            .findById(id)
            .populate(this.getStandardPopulate())
            .exec()

        return this.mapToPopulatedRole(role)
    }

    // PATCH /roles/:id
    async update(
        id: string,
        updateRoleDto: UpdateRoleDto
    ): Promise<PopulatedRoleDocument | null> {
        const updatedRole = await this.roleModel
            .findByIdAndUpdate(
                id,
                { roleName: updateRoleDto.roleName },
                { returnDocument: 'after' }
            )
            .populate(this.getStandardPopulate())
            .exec()

        return this.mapToPopulatedRole(updatedRole)
    }

    // PATCH /roles/:id/permissions/add
    async addPermissions(
        id: string,
        addPermissionsDto: AddPermissionsDto
    ): Promise<PopulatedRoleDocument | null> {
        const { permissions } = addPermissionsDto
        await this.validatePermissionsExists(permissions)

        const role = await this.roleModel.findById(id).exec()
        if (!role) throw new NotFoundException('Role not found')

        for (const incoming of permissions) {
            const incomingId = new Types.ObjectId(incoming.permissionId)

            const existingIndex = role.permissions.findIndex(
                (p) => p.permissionId.toString() === incoming.permissionId
            )

            if (existingIndex > -1) {
                role.permissions[existingIndex].canRead = incoming.canRead
                role.permissions[existingIndex].canWrite = incoming.canWrite
            } else {
                role.permissions.push({
                    permissionId: incomingId,
                    canRead: incoming.canRead,
                    canWrite: incoming.canWrite,
                })
            }
        }

        await role.save()
        return this.findOne(id)
    }

    // PATCH /roles/:id/permissions/remove
    async removePermissions(
        id: string,
        removePermissionsDto: RemovePermissionsDto
    ): Promise<PopulatedRoleDocument | null> {
        const { permissionIds } = removePermissionsDto
        const objectIds = permissionIds.map((pid) => new Types.ObjectId(pid))

        const updatedRole = await this.roleModel
            .findByIdAndUpdate(
                id,
                {
                    $pull: {
                        permissions: { permissionId: { $in: objectIds } },
                    },
                },
                { returnDocument: 'after' }
            )
            .populate(this.getStandardPopulate())
            .exec()

        return this.mapToPopulatedRole(updatedRole)
    }

    // DELETE /roles/:id
    async remove(id: string): Promise<RoleDocument | null> {
        return this.roleModel.findByIdAndDelete(id).exec()
    }
}
