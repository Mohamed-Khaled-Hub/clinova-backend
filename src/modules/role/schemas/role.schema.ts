// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument } from 'mongoose'
// Schemas
import { PermissionDocument } from '@/modules/permission/schemas/permission.schema'

// Document
export type RoleDocument = HydratedDocument<Role>

// Populated Document
export type PopulatedRoleDocument = Omit<RoleDocument, 'permissions'> & {
    permissions: {
        permission: Pick<PermissionDocument, '_id' | 'permissionKey'>
        canRead: boolean
        canWrite: boolean
    }[]
}

// Nested Schema
@Schema({ _id: false, versionKey: false })
export class RolePermission {
    @Prop({ type: Types.ObjectId, ref: 'Permission', required: true })
    permissionId: Types.ObjectId

    @Prop({ default: false }) canRead: boolean
    @Prop({ default: false }) canWrite: boolean
}

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Role {
    @Prop({ required: true, unique: true, trim: true, uppercase: true })
    roleName: string

    @Prop({ type: [RolePermission], default: [] })
    permissions: RolePermission[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
