// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
// Enums
import {
    PaymentMethodEnum,
    ExpenseCategoryEnum,
    FinancialStatusEnum,
} from '@/common/enums/schemas.enum'
// Schemas
import { UserDocument } from '@/modules/user/schemas/user.schema'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type ExpenseDocument = HydratedDocument<Expense>

// Populated Document
export type PopulatedExpenseDocument = Omit<
    ExpenseDocument,
    'recordedByUserId'
> & {
    recordedBy: Pick<
        UserDocument,
        '_id' | 'username' | 'fullNameEn' | 'fullNameAr'
    > | null
}

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Expense {
    @Prop({ type: String, enum: ExpenseCategoryEnum, required: true })
    expenseCategory: ExpenseCategoryEnum

    @Prop({ type: Number, required: true, min: 0 })
    expenseAmount: number

    @Prop({ type: Date, default: Date.now })
    expenseDate: Date

    @Prop({
        type: String,
        enum: PaymentMethodEnum,
        default: PaymentMethodEnum.CASH,
    })
    paymentMethod: PaymentMethodEnum

    @Prop({
        type: String,
        enum: FinancialStatusEnum,
        default: FinancialStatusEnum.PAID,
    })
    status: FinancialStatusEnum

    @Prop({ type: String })
    notes?: string

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    recordedByUserId: Types.ObjectId | null

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense)
