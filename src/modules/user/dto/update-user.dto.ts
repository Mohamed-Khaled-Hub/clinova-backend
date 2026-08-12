// Core
import { OmitType, PartialType } from '@nestjs/swagger'
// DTOs
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['password', 'roleId'] as const)
) {}
