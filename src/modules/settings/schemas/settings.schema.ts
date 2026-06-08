// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
// Enums
import { LangEnum } from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type SettingsDocument = HydratedDocument<Settings>

// Id
export const SETTINGS_ID = 'GLOBAL_SETTINGS'

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Settings {
    @Prop({ type: String, default: SETTINGS_ID })
    _id: string

    @Prop({ trim: true })
    clinicNameEn: string

    @Prop({ trim: true })
    clinicNameAr: string

    @Prop({ trim: true })
    clinicAddress: string

    @Prop({ type: [String], default: [] })
    clinicPhones: string[]

    @Prop({
        type: String,
        enum: LangEnum,
        default: LangEnum.AR,
    })
    primaryLanguage: LangEnum

    @Prop({ type: Boolean, default: true })
    aiAssistantEnabled: boolean

    @Prop({ trim: true })
    logoUrl: string

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const SettingsSchema = SchemaFactory.createForClass(Settings)
