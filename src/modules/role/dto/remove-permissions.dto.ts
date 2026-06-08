// Core
import { IsArray, IsMongoId } from 'class-validator'

export class RemovePermissionsDto {
    @IsArray()
    @IsMongoId({
        each: true,
        message: 'Each permissionId must be a valid MongoDB ObjectId',
    })
    permissionIds: string[]
}
