// Decorators
import { IsStrongPassword } from '@/common/decorators/strong-password.decorator'

export class PasswordDto {
    @IsStrongPassword()
    password: string
}
