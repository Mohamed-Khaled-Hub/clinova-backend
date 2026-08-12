// Decorators
import { IsStrongPassword } from '../decorators/strong-password.decorator'

export class PasswordDto {
    @IsStrongPassword()
    password: string
}
