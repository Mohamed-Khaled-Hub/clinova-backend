// Core
import {
    IsNotEmpty,
    IsEnum,
    IsNumber,
    Min,
    IsBoolean,
    IsOptional,
    IsObject,
} from 'class-validator'
// Enums
import { VisitCategoryEnum } from 'src/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from 'src/common/types/schemas.type'

export class CreatePriceCatalogDto {
    @IsNotEmpty()
    @IsEnum(VisitCategoryEnum)
    visitType: VisitCategoryEnum

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    basePrice: number

    @IsOptional()
    @IsBoolean()
    isPriceFlexible: boolean

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
