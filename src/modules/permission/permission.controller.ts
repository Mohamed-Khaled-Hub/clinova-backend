// Core
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto'
import { UpdatePermissionDto } from '@/modules/permission/dto/update-permission.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
// Schemas
import { PermissionDocument } from '@/modules/permission/schemas/permission.schema'
// Services
import { PermissionService } from '@/modules/permission/permission.service'

@Controller(EndpointsEnum.PERMISSION)
@UseGuards(RoleGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    // POST /permissions
    @Post()
    @RequirePermission(PermissionsEnum.PERMISSION, 'canWrite')
    async create(
        @Body() createPermissionDto: CreatePermissionDto
    ): Promise<PermissionDocument> {
        return this.permissionService.create(createPermissionDto)
    }

    // GET /permissions
    @Get()
    @RequirePermission(PermissionsEnum.PERMISSION, 'canRead')
    async findAll(): Promise<PermissionDocument[]> {
        return this.permissionService.findAll()
    }

    // GET /permissions/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.PERMISSION, 'canRead')
    async findOne(@Param('id') id: string): Promise<PermissionDocument> {
        const permission = await this.permissionService.findOne(id)
        if (!permission) throw new NotFoundException('Permission not found')
        return permission
    }

    // PATCH /permissions/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.PERMISSION, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updatePermissionDto: UpdatePermissionDto
    ): Promise<PermissionDocument> {
        const updatedPermission = await this.permissionService.update(
            id,
            updatePermissionDto
        )
        if (!updatedPermission)
            throw new NotFoundException('Permission not found')
        return updatedPermission
    }

    // DELETE /permissions/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.PERMISSION, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedPermission = await this.permissionService.remove(id)
        if (!deletedPermission)
            throw new NotFoundException('Permission not found')
        return { message: 'Permission deleted successfully' }
    }
}
