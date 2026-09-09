// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
    HydratedDocument,
    Schema as MongooseSchema,
    Query,
    Model,
} from 'mongoose'
// Enums
import {
    GenderEnum,
    MaritalStatusEnum,
    ReferralEnum,
} from '../../../common/enums/schemas.enum'
// Schemas
import { VisitDocument } from '../../visit/schemas/visit.schema'
import { RevenueDocument } from '../../revenue/schemas/revenue.schema'
// Types
import { CustomFieldsType } from '../../../common/types/schemas.type'

// Document
export type PatientDocument = HydratedDocument<Patient>

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Patient {
    @Prop({ required: true, trim: true })
    fullNameEn: string

    @Prop({ required: true, trim: true })
    fullNameAr: string

    @Prop({ type: Date, required: true })
    dob: Date

    @Prop({ required: true, trim: true })
    phone: string

    @Prop({ type: String, enum: GenderEnum, required: true })
    gender: GenderEnum

    @Prop({ trim: true, default: 'Egyptian' })
    nationality: string

    @Prop({
        type: String,
        enum: MaritalStatusEnum,
        default: MaritalStatusEnum.SINGLE,
    })
    maritalStatus: MaritalStatusEnum

    @Prop({ type: String, enum: ReferralEnum, default: ReferralEnum.OTHER })
    referralSource: ReferralEnum

    @Prop({ type: String })
    notes?: string

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const PatientSchema = SchemaFactory.createForClass(Patient)

PatientSchema.pre(
    ['findOneAndDelete', 'deleteOne'],
    { document: false, query: true },
    async function (this: Query<PatientDocument | null, PatientDocument>) {
        const model = this.model as Model<PatientDocument>
        const doc = await model.findOne(this.getFilter())
        if (!doc) return

        const visits = await this.model.db
            .model<VisitDocument>('Visit')
            .find({ patientId: doc._id }, { _id: 1 })
        const visitIds = visits.map((v) => v._id)

        await this.model.db
            .model<RevenueDocument>('Revenue')
            .deleteMany({ visitId: { $in: visitIds } })
        await this.model.db
            .model<VisitDocument>('Visit')
            .deleteMany({ patientId: doc._id })
    }
)
