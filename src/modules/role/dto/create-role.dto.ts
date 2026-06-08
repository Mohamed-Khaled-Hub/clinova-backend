// Core
import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsArray,
    ValidateNested,
    IsMongoId,
    Matches,
} from 'class-validator'
import { Type } from 'class-transformer'

export class RolePermissionDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'permissionId must be a valid MongoDB ObjectId' })
    permissionId: string

    @IsNotEmpty()
    @IsBoolean()
    canRead: boolean

    @IsNotEmpty()
    @IsBoolean()
    canWrite: boolean
}

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\w.-]+$/, {
        message:
            'roleName can only contain letters, numbers, underscores (_), dashes (-), and dots (.)',
    })
    roleName: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RolePermissionDto)
    permissions: RolePermissionDto[]
}
