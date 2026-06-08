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
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto'
import { UpdateRoleDto } from '@/modules/role/dto/update-role.dto'
import { AddPermissionsDto } from '@/modules/role/dto/add-permissions.dto'
import { RemovePermissionsDto } from '@/modules/role/dto/remove-permissions.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
// Schemas
import { PopulatedRoleDocument } from '@/modules/role/schemas/role.schema'
// Services
import { RoleService } from '@/modules/role/role.service'

@Controller(EndpointsEnum.ROLE)
@UseGuards(RoleGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    // POST /roles
    @Post()
    @RequirePermission(PermissionsEnum.ROLE, 'canWrite')
    async create(
        @Body() createRoleDto: CreateRoleDto
    ): Promise<PopulatedRoleDocument> {
        return this.roleService.create(createRoleDto)
    }

    // GET /roles
    @Get()
    @RequirePermission(PermissionsEnum.ROLE, 'canRead')
    async findAll(): Promise<PopulatedRoleDocument[]> {
        return this.roleService.findAll()
    }

    // GET /roles/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.ROLE, 'canRead')
    async findOne(@Param('id') id: string): Promise<PopulatedRoleDocument> {
        const role = await this.roleService.findOne(id)
        if (!role) throw new NotFoundException('Role not found')
        return role
    }

    // PATCH /roles/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.ROLE, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto
    ): Promise<PopulatedRoleDocument> {
        const updatedRole = await this.roleService.update(id, updateRoleDto)
        if (!updatedRole) throw new NotFoundException('Role not found')
        return updatedRole
    }

    // PATCH /roles/:id/permissions/add
    @Patch(':id/permissions/add')
    @RequirePermission(PermissionsEnum.ROLE, 'canWrite')
    async addPermissions(
        @Param('id') id: string,
        @Body() addPermissionsDto: AddPermissionsDto
    ): Promise<PopulatedRoleDocument> {
        const updatedRole = await this.roleService.addPermissions(
            id,
            addPermissionsDto
        )
        if (!updatedRole) throw new NotFoundException('Role not found')
        return updatedRole
    }

    // PATCH /roles/:id/permissions/remove
    @Patch(':id/permissions/remove')
    @RequirePermission(PermissionsEnum.ROLE, 'canWrite')
    async removePermissions(
        @Param('id') id: string,
        @Body() removePermissionsDto: RemovePermissionsDto
    ): Promise<PopulatedRoleDocument> {
        const updatedRole = await this.roleService.removePermissions(
            id,
            removePermissionsDto
        )
        if (!updatedRole) throw new NotFoundException('Role not found')
        return updatedRole
    }

    // DELETE /roles/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.ROLE, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedRole = await this.roleService.remove(id)
        if (!deletedRole) throw new NotFoundException('Role not found')
        return { message: 'Role deleted successfully' }
    }
}
