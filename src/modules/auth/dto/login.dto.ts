// Core
import { IsNotEmpty, IsString } from 'class-validator'
// DTOs
import { PasswordDto } from '@/common/dto/password.dto'

export class LoginDto extends PasswordDto {
    @IsNotEmpty()
    @IsString()
    username: string
}
