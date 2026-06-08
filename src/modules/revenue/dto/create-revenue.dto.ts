// Core
import {
    IsNotEmpty,
    IsMongoId,
    IsNumber,
    Min,
    IsOptional,
    IsEnum,
    IsDate,
    IsString,
    IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
// Enums
import {
    PaymentMethodEnum,
    FinancialStatusEnum,
} from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class CreateRevenueDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'visitId must be a valid MongoDB ObjectId' })
    visitId: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    transactionAmount?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountAmount?: number

    @IsOptional()
    @IsEnum(PaymentMethodEnum)
    paymentMethod?: PaymentMethodEnum

    @IsOptional()
    @IsEnum(FinancialStatusEnum)
    status?: FinancialStatusEnum

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    transactionDate?: Date

    @IsOptional()
    @IsString()
    notes?: string

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
