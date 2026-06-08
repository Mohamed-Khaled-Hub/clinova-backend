// Core
import {
    IsNotEmpty,
    IsString,
    IsMongoId,
    IsOptional,
    IsUrl,
    IsObject,
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
