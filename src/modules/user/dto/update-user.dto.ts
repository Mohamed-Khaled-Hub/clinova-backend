// Core
import { OmitType, PartialType } from '@nestjs/swagger'
// DTOs
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto'

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, ['password', 'roleId'] as const)
) {}
