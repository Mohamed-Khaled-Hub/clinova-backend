// Core
import { ConflictException } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, HydratedDocument, Query, Model } from 'mongoose'
// Schemas
import { UserDocument } from '../../user/schemas/user.schema'
import { PermissionDocument } from '../../permission/schemas/permission.schema'

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

RoleSchema.pre(
    ['findOneAndDelete', 'deleteOne'],
    { document: false, query: true },
    async function (this: Query<RoleDocument | null, RoleDocument>) {
        const model = this.model as Model<RoleDocument>
        const doc = await model.findOne(this.getFilter())
        if (doc) {
            const inUse = await this.model.db
                .model<UserDocument>('User')
                .exists({ roleId: doc._id })
            if (inUse) {
                throw new ConflictException(
                    'Cannot delete a role assigned to existing users'
                )
            }
        }
    }
)
