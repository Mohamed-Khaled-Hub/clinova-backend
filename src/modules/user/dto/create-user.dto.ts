// Core
import {
    IsNotEmpty,
    IsString,
    IsMongoId,
    IsOptional,
    IsUrl,
    IsObject,
    Matches,
} from 'class-validator'
// Decorators
import { IsArabic } from '@/common/decorators/arabic.decorator'
// DTOs
import { PasswordDto } from '@/common/dto/password.dto'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class CreateUserDto extends PasswordDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z0-9._-]{3,16}$/, {
        message:
            'Username must be between 3 and 16 characters long and can only contain lowercase letters, numbers, underscores (_), dashes (-), and dots (.)',
    })
    username: string

    @IsNotEmpty()
    @IsMongoId({ message: 'roleId must be a valid MongoDB ObjectId' })
    roleId: string

    @IsOptional()
    @IsString()
    fullNameEn?: string

    @IsOptional()
    @IsString()
    @IsArabic('fullNameAr')
    fullNameAr?: string

    @IsOptional()
    @IsUrl({}, { message: 'imageUrl must be a valid URL string' })
    imageUrl?: string

    @IsOptional()
    @IsString()
    specializationEn?: string

    @IsOptional()
    @IsString()
    @IsArabic('specializationAr')
    specializationAr?: string

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
