// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, Schema as MongooseSchema } from 'mongoose'
// Enums
import {
    VisitCategoryEnum,
    NoteCategoryEnum,
} from '@/common/enums/schemas.enum'
// Schemas
import { PatientDocument } from '@/modules/patient/schemas/patient.schema'
import { UserDocument } from '@/modules/user/schemas/user.schema'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type VisitDocument = HydratedDocument<Visit>

// Populated Document
export type PopulatedVisitDocument = Omit<
    VisitDocument,
    'patientId' | 'doctorId'
> & {
    patient: Pick<PatientDocument, '_id' | 'fullNameEn' | 'fullNameAr'>
    doctor: Pick<UserDocument, '_id' | 'username' | 'fullNameEn' | 'fullNameAr'>
}

// Nested Schema
@Schema({ _id: false, versionKey: false })
export class VisitNote {
    @Prop({ type: String, enum: NoteCategoryEnum, required: true })
    category: NoteCategoryEnum

    @Prop({ required: true })
    noteText: string

    @Prop({ type: Date, default: null })
    contentDate: Date | null

    @Prop({ type: String, default: null })
    highlightColor: string | null
}

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Visit {
    @Prop({
        type: Types.ObjectId,
        ref: 'Patient',
        required: true,
    })
    patientId: Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    })
    doctorId: Types.ObjectId

    @Prop({ type: Date, default: Date.now })
    visitDate: Date

    @Prop({
        type: String,
        enum: VisitCategoryEnum,
        required: true,
    })
    visitType: VisitCategoryEnum

    @Prop({ type: String })
    visitTypeOtherDescription?: string

    @Prop({ type: Number, min: 0 })
    height?: number

    @Prop({ type: Number, min: 0 })
    weight?: number

    @Prop({ type: String })
    bloodPressure?: string

    @Prop({
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    nextVisitDate: Date

    @Prop({
        type: String,
        enum: VisitCategoryEnum,
        default: VisitCategoryEnum.CONSULTATION,
    })
    nextVisitType: VisitCategoryEnum

    @Prop({ type: String })
    nextVisitTypeOtherDescription?: string

    @Prop({ type: [VisitNote], default: [] })
    notes: VisitNote[]

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const VisitSchema = SchemaFactory.createForClass(Visit)

VisitSchema.index({ 'notes.noteText': 1 })
