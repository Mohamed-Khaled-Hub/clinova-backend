// Core
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// DTOs
import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto'
import { UpdatePermissionDto } from '@/modules/permission/dto/update-permission.dto'
// Schemas
import {
    Permission,
    PermissionDocument,
} from '@/modules/permission/schemas/permission.schema'

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name)
        private readonly permissionModel: Model<PermissionDocument>
    ) {}

    // POST /permissions
    async create(
        createPermissionDto: CreatePermissionDto
    ): Promise<PermissionDocument> {
        const createdPermission = new this.permissionModel(createPermissionDto)
        return await createdPermission.save()
    }

    // GET /permissions
    async findAll(): Promise<PermissionDocument[]> {
        return this.permissionModel.find().exec()
    }

    // GET /permissions/:id
    async findOne(id: string): Promise<PermissionDocument | null> {
        return this.permissionModel.findById(id).exec()
    }

    // PATCH /permissions/:id
    async update(
        id: string,
        updatePermissionDto: UpdatePermissionDto
    ): Promise<PermissionDocument | null> {
        return this.permissionModel
            .findByIdAndUpdate(id, updatePermissionDto, {
                returnDocument: 'after',
            })
            .exec()
    }

    // DELETE /permissions/:id
    async remove(id: string): Promise<PermissionDocument | null> {
        return this.permissionModel.findByIdAndDelete(id).exec()
    }
}
