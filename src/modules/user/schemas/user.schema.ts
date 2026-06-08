// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
// Schemas
import { RoleDocument } from '@/modules/role/schemas/role.schema'
import { PermissionDocument } from '@/modules/permission/schemas/permission.schema'
// Types
import { CustomFieldsType } from '@/common/types/schemas.type'

// Document
export type UserDocument = HydratedDocument<User>

// Populated Document
export type PopulatedUserDocument = Omit<UserDocument, 'roleId'> & {
    passwordHash?: string
    hashedRefreshToken?: string | null
    role: Omit<
        Pick<RoleDocument, '_id' | 'roleName' | 'permissions'>,
        'permissions'
    > & {
        permissions: {
            permission: Pick<PermissionDocument, '_id' | 'permissionKey'>
            canRead: boolean
            canWrite: boolean
        }[]
    }
}

// Schema
@Schema({ timestamps: true, versionKey: false })
export class User {
    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true })
    passwordHash: string

    @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
    roleId: Types.ObjectId

    @Prop({ trim: true }) fullNameEn: string
    @Prop({ trim: true }) fullNameAr: string
    @Prop({ trim: true }) imageUrl: string
    @Prop({ trim: true }) specializationEn: string
    @Prop({ trim: true }) specializationAr: string

    @Prop({ type: String, default: null })
    hashedRefreshToken: string | null

    @Prop({ type: Map, of: MongooseSchema.Types.Mixed, default: {} })
    customFields: Map<string, CustomFieldsType>
}

export const UserSchema = SchemaFactory.createForClass(User)
