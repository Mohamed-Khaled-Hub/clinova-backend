// Core
import { IsNotEmpty, IsMongoId } from 'class-validator'

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'roleId must be a valid MongoDB ObjectId' })
    roleId: string
}
