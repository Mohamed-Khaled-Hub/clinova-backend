// Core
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\w.-]+$/, {
        message:
            'roleName can only contain letters, numbers, underscores (_), dashes (-), and dots (.)',
    })
    roleName: string
}
