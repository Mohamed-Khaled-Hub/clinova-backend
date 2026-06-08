// Core
import * as bcrypt from 'bcrypt'
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, PipelineStage, QueryFilter } from 'mongoose'
// DTOs
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UpdateUserRoleDto } from '@/modules/user/dto/update-user-role.dto'
// Enums
import { RolesEnum } from '@/common/enums/roles-permissions.enum'
// Schemas
import { PopulatedRoleDocument } from '@/modules/role/schemas/role.schema'
import {
    User,
    UserDocument,
    PopulatedUserDocument,
} from '@/modules/user/schemas/user.schema'
// Services
import { RoleService } from '@/modules/role/role.service'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly roleService: RoleService
    ) {}

    // Helpers
    private getPopulatedUserPipeline(
        matchStage: QueryFilter<UserDocument> = {},
        includeSecrets = false
    ): PipelineStage[] {
        return [
            ...(Object.keys(matchStage).length > 0
                ? [{ $match: matchStage }]
                : []),

            {
                $lookup: {
                    from: 'roles',
                    localField: 'roleId',
                    foreignField: '_id',
                    as: 'role',
                },
            },
            {
                $unwind: {
                    path: '$role',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: 'permissions',
                    localField: 'role.permissions.permissionId',
                    foreignField: '_id',
                    as: 'permissionDocs',
                },
            },

            {
                $addFields: {
                    'role.permissions': {
                        $map: {
                            input: '$role.permissions',
                            as: 'perm',
                            in: {
                                permission: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$permissionDocs',
                                                as: 'permissionDoc',
                                                cond: {
                                                    $eq: [
                                                        '$$permissionDoc._id',
                                                        '$$perm.permissionId',
                                                    ],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                canRead: '$$perm.canRead',
                                canWrite: '$$perm.canWrite',
                            },
                        },
                    },
                },
            },

            {
                $project: {
                    ...(includeSecrets
                        ? { passwordHash: 1, hashedRefreshToken: 1 }
                        : {}),
                    username: 1,
                    fullNameEn: 1,
                    fullNameAr: 1,
                    imageUrl: 1,
                    specializationEn: 1,
                    specializationAr: 1,
                    customFields: 1,
                    createdAt: 1,
                    updatedAt: 1,

                    role: {
                        _id: '$role._id',
                        roleName: '$role.roleName',
                        permissions: {
                            $map: {
                                input: '$role.permissions',
                                as: 'perm',
                                in: {
                                    permission: {
                                        _id: '$$perm.permission._id',
                                        permissionKey:
                                            '$$perm.permission.permissionKey',
                                    },
                                    canRead: '$$perm.canRead',
                                    canWrite: '$$perm.canWrite',
                                },
                            },
                        },
                    },
                },
            },
        ]
    }

    private async validateRoleExists(
        roleId: string
    ): Promise<PopulatedRoleDocument> {
        const role = await this.roleService.findOne(roleId)
        if (!role) {
            throw new BadRequestException(`Role ID "${roleId}" does not exist`)
        }
        return role
    }

    private async enforceRoleHierarchy(
        targetRoleId: string,
        actorUserId: string
    ): Promise<void> {
        const targetRole = await this.validateRoleExists(targetRoleId)
        const targetRoleName = String(targetRole.roleName)

        if (
            targetRoleName === String(RolesEnum.SUPER_ADMIN) ||
            targetRoleName === String(RolesEnum.ADMIN)
        ) {
            const actorUserDoc = await this.findOne(actorUserId)

            const actorRoleName = actorUserDoc?.role
                ? String(actorUserDoc.role.roleName)
                : ''

            if (actorRoleName !== String(RolesEnum.SUPER_ADMIN)) {
                throw new ForbiddenException(
                    `Only a Super Admin is authorized to grant, create, or modify ${targetRole.roleName} tiers.`
                )
            }
        }
    }

    async updatePassword(id: string, newPasswordHash: string): Promise<void> {
        const result = await this.userModel
            .findByIdAndUpdate(id, { passwordHash: newPasswordHash })
            .exec()

        if (!result) {
            throw new BadRequestException(
                'User profile not found for password mutation.'
            )
        }
    }

    async updateRefreshToken(
        id: string,
        hashedRefreshToken: string | null
    ): Promise<void> {
        const result = await this.userModel
            .findByIdAndUpdate(id, { hashedRefreshToken })
            .exec()

        if (!result) {
            throw new BadRequestException(
                'User profile not found for refresh token mutation.'
            )
        }
    }

    async createRaw(
        createUserDto: CreateUserDto
    ): Promise<PopulatedUserDocument> {
        await this.validateRoleExists(createUserDto.roleId)

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(createUserDto.password, salt)

        const createdUser = new this.userModel({
            ...createUserDto,
            roleId: new Types.ObjectId(createUserDto.roleId),
            passwordHash,
        })

        const savedUser = await createdUser.save()
        return (await this.findOne(
            savedUser._id.toString()
        )) as PopulatedUserDocument
    }

    // POST /users
    async create(
        createUserDto: CreateUserDto,
        currentUserId: string
    ): Promise<PopulatedUserDocument> {
        await this.enforceRoleHierarchy(createUserDto.roleId, currentUserId)
        return this.createRaw(createUserDto)
    }

    // GET /users
    async findAll(includeSecrets = false): Promise<PopulatedUserDocument[]> {
        return this.userModel
            .aggregate<PopulatedUserDocument>(
                this.getPopulatedUserPipeline({}, includeSecrets)
            )
            .exec()
    }

    // GET /users/:id & GET /users/me
    async findOne(
        id: string,
        includeSecrets = false
    ): Promise<PopulatedUserDocument | null> {
        const results = await this.userModel
            .aggregate<PopulatedUserDocument>(
                this.getPopulatedUserPipeline(
                    {
                        _id: new Types.ObjectId(id),
                    },
                    includeSecrets
                )
            )
            .exec()

        return results[0] ?? null
    }

    // GET /users/username/:username
    async findByUsername(
        username: string,
        includeSecrets = false
    ): Promise<PopulatedUserDocument | null> {
        const results = await this.userModel
            .aggregate<PopulatedUserDocument>(
                this.getPopulatedUserPipeline(
                    {
                        username,
                    },
                    includeSecrets
                )
            )
            .exec()

        return results[0] ?? null
    }

    // PATCH /users/:id
    async update(
        id: string,
        updateUserDto: UpdateUserDto
    ): Promise<PopulatedUserDocument | null> {
        if ('passwordHash' in updateUserDto) {
            throw new BadRequestException(
                'Password updates are forbidden on this endpoint.'
            )
        }
        if ('roleId' in updateUserDto) {
            throw new BadRequestException(
                'Role modifications are forbidden on this endpoint.'
            )
        }

        await this.userModel.findByIdAndUpdate(id, updateUserDto).exec()
        return this.findOne(id)
    }

    // PATCH /users/:id/role & PATCH /users/me
    async updateRole(
        id: string,
        updateUserRoleDto: UpdateUserRoleDto,
        currentUserId: string
    ): Promise<PopulatedUserDocument | null> {
        if (id === currentUserId) {
            throw new BadRequestException(
                'Privilege escalation security warning: You cannot modify your own access tier role.'
            )
        }

        await this.enforceRoleHierarchy(updateUserRoleDto.roleId, currentUserId)

        await this.userModel
            .findByIdAndUpdate(id, {
                roleId: new Types.ObjectId(updateUserRoleDto.roleId),
            })
            .exec()
        return this.findOne(id)
    }

    // DELETE /users/:id
    async remove(id: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(id).exec()
    }
}
