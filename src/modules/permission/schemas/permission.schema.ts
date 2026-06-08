// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

// Document
export type PermissionDocument = HydratedDocument<Permission>

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Permission {
    @Prop({ required: true, unique: true, trim: true, uppercase: true })
    permissionKey: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)
