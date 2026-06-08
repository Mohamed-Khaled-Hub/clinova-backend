// Core
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator'

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'userId must be a valid MongoDB ObjectId' })
    userId: string

    @IsNotEmpty()
    @IsString()
    refreshToken: string
}
