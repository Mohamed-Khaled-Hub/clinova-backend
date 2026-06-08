// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Schema as MongooseSchema, HydratedDocument } from 'mongoose'
// Schemas
import { UserDocument } from '@/modules/user/schemas/user.schema'
import { VisitDocument } from '@/modules/visit/schemas/visit.schema'
import { PatientDocument } from '@/modules/patient/schemas/patient.schema'
// Enums
import {
    PaymentMethodEnum,
    FinancialStatusEnum,
} from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type RevenueDocument = HydratedDocument<Revenue>

// Populated Document
export type PopulatedRevenueDocument = Omit<
    RevenueDocument,
    'visitId' | 'recordedByUserId'
> & {
    visit: Pick<VisitDocument, '_id' | 'visitDate' | 'visitType'> & {
        patient: Pick<PatientDocument, '_id' | 'fullNameEn' | 'fullNameAr'>
        doctor: Pick<
            UserDocument,
            '_id' | 'username' | 'fullNameEn' | 'fullNameAr'
        >
    }
    recordedBy: Pick<
        UserDocument,
        '_id' | 'username' | 'fullNameEn' | 'fullNameAr'
    > | null
}

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Revenue {
    @Prop({ type: Types.ObjectId, ref: 'Visit', required: true })
    visitId: Types.ObjectId

    @Prop({ type: Number, min: 0, default: 0 })
    transactionAmount: number

    @Prop({ type: Number, min: 0, default: 0 })
    discountAmount: number

    @Prop({ type: Number, min: 0 })
    finalAmount: number

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

    @Prop({ type: Date, default: Date.now })
    transactionDate: Date

    @Prop({ type: String })
    notes?: string

    @Prop({ type: Types.ObjectId, ref: 'User', default: null })
    recordedByUserId: Types.ObjectId | null

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue)
