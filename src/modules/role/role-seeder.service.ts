// Core
import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { Types } from 'mongoose'
// Enums
import {
    PermissionsEnum,
    RolesEnum,
} from '@/common/enums/roles-permissions.enum'
// Schemas
import { RolePermission } from '@/modules/role/schemas/role.schema'
// Services
import { RoleService } from '@/modules/role/role.service'
import { PermissionService } from '@/modules/permission/permission.service'
// Variables
import { ROLES_PERMISSIONS_MATRIX } from '@/common/constants/roles-permissions.constants'

@Injectable()
export class RoleSeederService implements OnModuleInit {
    private readonly logger = new Logger(RoleSeederService.name)

    constructor(
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService
    ) {}

    async onModuleInit() {
        this.logger.log('Checking database seed status...')
        const existingRoles = await this.roleService.findAll()
        if (existingRoles && existingRoles.length > 0) {
            this.logger.debug(
                'Database roles and permissions are already initialized. Skipping roles and permissions seeder lifecycle.'
            )
            return
        }

        this.logger.log('Executing roles and permissions database seeds...')
        await this.seedPermissions()
        await this.seedRoles()
    }

    private async seedPermissions(): Promise<void> {
        const permissions = Object.values(PermissionsEnum)
        const allPermissionsInDb = await this.permissionService.findAll()

        for (const permissionName of permissions) {
            const existingPermission = allPermissionsInDb.find(
                (p) => String(p.permissionKey) === String(permissionName)
            )

            if (!existingPermission) {
                await this.permissionService.create({
                    permissionKey: permissionName,
                })
                this.logger.log(
                    `Permission created successfully: "${permissionName}"`
                )
            }
        }
    }

    private async seedRoles(): Promise<void> {
        const allPermissionsInDb = await this.permissionService.findAll()
        const allRolesInDb = await this.roleService.findAll()

        for (const roleKey of Object.keys(
            ROLES_PERMISSIONS_MATRIX
        ) as RolesEnum[]) {
            const matrixRoleConfig = ROLES_PERMISSIONS_MATRIX[roleKey]

            const existingRole = allRolesInDb.find(
                (role) =>
                    String(role.roleName) === String(matrixRoleConfig.roleName)
            )

            const structuralPermissionsArray: Array<
                RolePermission & { permissionKey: string }
            > = []

            for (const pConfig of matrixRoleConfig.permissions) {
                const dbPermission = allPermissionsInDb.find(
                    (p) =>
                        String(p.permissionKey) ===
                        String(pConfig.permissionKey)
                )

                if (!dbPermission) {
                    this.logger.error(
                        `Permission reference "${pConfig.permissionKey}" not found in database permissions collection. Skipping this assignment for role "${matrixRoleConfig.roleName}".`
                    )
                    continue
                }

                structuralPermissionsArray.push({
                    permissionId: new Types.ObjectId(dbPermission._id),
                    permissionKey: pConfig.permissionKey,
                    canRead: pConfig.canRead,
                    canWrite: pConfig.canWrite,
                })
            }

            if (!existingRole) {
                await this.roleService.create({
                    roleName: matrixRoleConfig.roleName,
                    permissions: structuralPermissionsArray.map((p) => ({
                        permissionId: String(p.permissionId),
                        canRead: p.canRead,
                        canWrite: p.canWrite,
                    })),
                })

                this.logger.log(
                    `Role seeded successfully: "${matrixRoleConfig.roleName}"`
                )
            } else {
                let updatedCount = 0

                for (const incomingPerm of structuralPermissionsArray) {
                    const basePermissionIdStr = String(
                        incomingPerm.permissionId
                    )

                    const hasPermission = existingRole.permissions.some(
                        (existingPerm) => {
                            const existingId = String(
                                existingPerm.permission._id
                            )

                            return existingId === basePermissionIdStr
                        }
                    )

                    if (hasPermission) {
                        this.logger.debug(
                            `Permission "${incomingPerm.permissionKey}" already exists for role "${matrixRoleConfig.roleName}". Skipping...`
                        )
                        continue
                    }

                    existingRole.permissions.push({
                        permission: {
                            _id: new Types.ObjectId(incomingPerm.permissionId),
                            permissionKey: incomingPerm.permissionKey,
                        },
                        canRead: incomingPerm.canRead,
                        canWrite: incomingPerm.canWrite,
                    })
                    updatedCount++
                }

                if (updatedCount > 0) {
                    await existingRole.save()
                    this.logger.log(
                        `Appended ${updatedCount} new permission(s) to existing role: "${matrixRoleConfig.roleName}"`
                    )
                }
            }
        }
    }
}
