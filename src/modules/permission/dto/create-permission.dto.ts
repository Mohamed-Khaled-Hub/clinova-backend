// Core
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[\w.-]+$/, {
        message:
            'permissionKey can only contain letters, numbers, underscores (_), dashes (-), and dots (.)',
    })
    permissionKey: string
}
