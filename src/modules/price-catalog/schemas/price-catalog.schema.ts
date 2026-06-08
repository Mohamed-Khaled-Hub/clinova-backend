// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
// Enums
import { VisitCategoryEnum } from '@/common/enums/schemas.enum'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type PriceCatalogDocument = HydratedDocument<PriceCatalog>

// Schema
@Schema({ timestamps: true, versionKey: false })
export class PriceCatalog {
    @Prop({
        type: String,
        enum: VisitCategoryEnum,
        required: true,
        unique: true,
    })
    visitType: VisitCategoryEnum

    @Prop({ type: Number, required: true, min: 0 })
    basePrice: number

    @Prop({ type: Boolean, default: false })
    isPriceFlexible: boolean

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const PriceCatalogSchema = SchemaFactory.createForClass(PriceCatalog)
