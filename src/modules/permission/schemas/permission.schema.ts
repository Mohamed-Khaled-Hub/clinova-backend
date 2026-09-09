// Core
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Query, Model } from 'mongoose'
// Schemas
import { RoleDocument } from '../../role/schemas/role.schema'

// Document
export type PermissionDocument = HydratedDocument<Permission>

// Schema
@Schema({ timestamps: true, versionKey: false })
export class Permission {
    @Prop({ required: true, unique: true, trim: true, uppercase: true })
    permissionKey: string
}

export const PermissionSchema = SchemaFactory.createForClass(Permission)

PermissionSchema.pre(
    ['findOneAndDelete', 'deleteOne'],
    { document: false, query: true },
    async function (
        this: Query<PermissionDocument | null, PermissionDocument>
    ) {
        const model = this.model as Model<PermissionDocument>
        const doc = await model.findOne(this.getFilter())
        if (doc) {
            await this.model.db
                .model<RoleDocument>('Role')
                .updateMany(
                    { 'permissions.permissionId': doc._id },
                    { $pull: { permissions: { permissionId: doc._id } } }
                )
        }
    }
)
