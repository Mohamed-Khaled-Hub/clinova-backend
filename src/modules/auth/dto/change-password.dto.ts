// Decorators
import { IsStrongPassword } from '@/common/decorators/strong-password.decorator'

export class ChangePasswordDto {
    @IsStrongPassword('Old password')
    oldPassword: string

    @IsStrongPassword('New password')
    newPassword: string
}
