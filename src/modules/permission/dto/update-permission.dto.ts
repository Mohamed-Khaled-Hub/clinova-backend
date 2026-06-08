// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto'

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
