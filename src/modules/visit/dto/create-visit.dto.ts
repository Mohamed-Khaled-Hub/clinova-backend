// Core
import {
    IsNotEmpty,
    IsMongoId,
    IsEnum,
    IsOptional,
    IsString,
    IsNumber,
    Min,
    IsDate,
    IsArray,
    ValidateNested,
    IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
import { OmitType } from '@nestjs/mapped-types'
// DTOs
import { CreateRevenueDto } from '@/modules/revenue/dto/create-revenue.dto'
// Enums
import {
    VisitCategoryEnum,
    NoteCategoryEnum,
} from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class NestedRevenueDetailsDto extends OmitType(CreateRevenueDto, [
    'visitId',
] as const) {}

export class VisitNoteDto {
    @IsNotEmpty()
    @IsEnum(NoteCategoryEnum)
    category: NoteCategoryEnum

    @IsNotEmpty()
    @IsString()
    noteText: string

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    contentDate?: Date

    @IsOptional()
    @IsString()
    highlightColor?: string
}

export class CreateVisitDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'patientId must be a valid MongoDB ObjectId' })
    patientId: string

    @IsNotEmpty()
    @IsMongoId({ message: 'doctorId must be a valid MongoDB ObjectId' })
    doctorId: string

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    visitDate?: Date

    @IsNotEmpty()
    @IsEnum(VisitCategoryEnum)
    visitType: VisitCategoryEnum

    @IsOptional()
    @IsString()
    visitTypeOtherDescription?: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    height?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number

    @IsOptional()
    @IsString()
    bloodPressure?: string

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    nextVisitDate?: Date

    @IsOptional()
    @IsEnum(VisitCategoryEnum)
    nextVisitType?: VisitCategoryEnum

    @IsOptional()
    @IsString()
    nextVisitTypeOtherDescription?: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VisitNoteDto)
    notes?: VisitNoteDto[]

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>

    @IsOptional()
    @ValidateNested()
    @Type(() => NestedRevenueDetailsDto)
    revenueDetails?: NestedRevenueDetailsDto
}
