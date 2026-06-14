// Core
import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsEnum,
    IsOptional,
    IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
// Decorators
import { IsArabic } from '@/common/decorators/arabic.decorator'
import { IsEgyptianPhone } from '@/common/decorators/egyptian-phone.decorator'
// Enums
import {
    GenderEnum,
    MaritalStatusEnum,
    ReferralEnum,
} from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    fullNameEn: string

    @IsNotEmpty()
    @IsString()
    @IsArabic('fullNameAr')
    fullNameAr: string

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dob: Date

    @IsNotEmpty()
    @IsEgyptianPhone('Patient phone')
    phone: string

    @IsNotEmpty()
    @IsEnum(GenderEnum)
    gender: GenderEnum

    @IsOptional()
    @IsString()
    nationality?: string

    @IsOptional()
    @IsEnum(MaritalStatusEnum)
    maritalStatus?: MaritalStatusEnum

    @IsOptional()
    @IsEnum(ReferralEnum)
    referralSource?: ReferralEnum

    @IsOptional()
    @IsString()
    notes?: string

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
