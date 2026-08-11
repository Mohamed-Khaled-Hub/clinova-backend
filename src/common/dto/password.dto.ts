// Decorators
import { IsStrongPassword } from 'src/common/decorators/strong-password.decorator'

export class PasswordDto {
    @IsStrongPassword()
    password: string
}
