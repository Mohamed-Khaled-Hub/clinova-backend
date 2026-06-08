// Core
import {
    Min,
    IsDate,
    IsEnum,
    IsString,
    IsObject,
    IsNumber,
    IsNotEmpty,
    IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'
// Enums
import {
    ExpenseCategoryEnum,
    PaymentMethodEnum,
    FinancialStatusEnum,
} from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

export class CreateExpenseDto {
    @IsNotEmpty()
    @IsEnum(ExpenseCategoryEnum)
    expenseCategory: ExpenseCategoryEnum

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    expenseAmount: number

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    expenseDate?: Date

    @IsOptional()
    @IsEnum(PaymentMethodEnum)
    paymentMethod?: PaymentMethodEnum

    @IsOptional()
    @IsEnum(FinancialStatusEnum)
    status?: FinancialStatusEnum

    @IsOptional()
    @IsString()
    notes?: string

    @IsOptional()
    @IsObject()
    customFields?: Record<string, CustomFieldsType>
}
