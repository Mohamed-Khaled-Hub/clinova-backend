// Core
import {
    IsOptional,
    IsString,
    IsArray,
    IsBoolean,
    IsObject,
    IsEnum,
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
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
