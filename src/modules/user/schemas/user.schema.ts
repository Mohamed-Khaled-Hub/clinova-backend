// Core
import { ConflictException } from '@nestjs/common'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {
    HydratedDocument,
    Schema as MongooseSchema,
    Types,
    Query,
    Model,
} from 'mongoose'
// Schemas
import { RoleDocument } from '../../role/schemas/role.schema'
import { VisitDocument } from '../../visit/schemas/visit.schema'
import { ExpenseDocument } from '../../expense/schemas/expense.schema'
import { RevenueDocument } from '../../revenue/schemas/revenue.schema'
import { PermissionDocument } from '../../permission/schemas/permission.schema'
// Types
import { CustomFieldsType } from '../../../common/types/schemas.type'

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
    @Prop({ required: true, lowercase: true, unique: true })
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

UserSchema.pre(
    ['findOneAndDelete', 'deleteOne'],
    { document: false, query: true },
    async function (this: Query<UserDocument | null, UserDocument>) {
        const model = this.model as Model<UserDocument>
        const doc = await model.findOne(this.getFilter())
        if (!doc) return

        const hasVisits = await this.model.db
            .model<VisitDocument>('Visit')
            .exists({ doctorId: doc._id })
        if (hasVisits) {
            throw new ConflictException(
                'Cannot delete a user who is assigned as a doctor on visits'
            )
        }

        await Promise.all([
            this.model.db
                .model<ExpenseDocument>('Expense')
                .updateMany(
                    { recordedByUserId: doc._id },
                    { recordedByUserId: null }
                ),
            this.model.db
                .model<RevenueDocument>('Revenue')
                .updateMany(
                    { recordedByUserId: doc._id },
                    { recordedByUserId: null }
                ),
        ])
    }
)
