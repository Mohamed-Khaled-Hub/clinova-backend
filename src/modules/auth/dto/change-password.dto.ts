// Decorators
import { IsStrongPassword } from 'src/common/decorators/strong-password.decorator'

export class ChangePasswordDto {
    @IsStrongPassword('Old password')
    oldPassword: string

    @IsStrongPassword('New password')
    newPassword: string
}
