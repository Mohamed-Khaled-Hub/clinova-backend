// Core
import { IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
// DTOs
import { RolePermissionDto } from '@/modules/role/dto/create-role.dto'

export class AddPermissionsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RolePermissionDto)
    permissions: RolePermissionDto[]
}
