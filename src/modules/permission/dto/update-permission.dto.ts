// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreatePermissionDto } from './create-permission.dto'

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
