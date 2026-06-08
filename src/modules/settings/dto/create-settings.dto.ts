// Core
import {
    IsOptional,
    IsString,
    IsArray,
    IsBoolean,
    IsUrl,
    IsObject,
    IsEnum,
    Matches,
} from 'class-validator'
// Decorators
import { IsArabic } from '@/common/decorators/arabic.decorator'
import { IsEgyptianPhone } from '@/common/decorators/egyptian-phone.decorator'
// Enums
import { LangEnum } from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class CreateSettingsDto {
    @IsOptional()
    @IsString()
    clinicNameEn?: string

    @IsOptional()
    @IsString()
    @IsArabic('clinicNameAr')
    clinicNameAr?: string

    @IsOptional()
    @IsString()
    clinicAddress?: string

    @IsOptional()
    @IsArray()
    @IsEgyptianPhone('Each clinic phone', { each: true })
    clinicPhones?: string[]

    @IsOptional()
    @IsEnum(LangEnum)
    primaryLanguage?: LangEnum

    @IsOptional()
    @IsBoolean()
    aiAssistantEnabled?: boolean

    @IsOptional()
    @IsUrl({}, { message: 'logoUrl must be a valid URL string' })
    @Matches(/\.(jpeg|jpg|gif|png|svg|webp)(?:\?.*)?$/i, {
        message:
            'logoUrl must point to a valid image file extension (jpeg, jpg, png, svg, webp, gif).',
    })
    logoUrl?: string

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
