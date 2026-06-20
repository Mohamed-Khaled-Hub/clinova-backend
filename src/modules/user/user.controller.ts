// Core
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UpdateUserRoleDto } from '@/modules/user/dto/update-user-role.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
import type { AuthenticatedRequest } from '@/modules/auth/interfaces/auth.interface'
// Schemas
import { PopulatedUserDocument } from '@/modules/user/schemas/user.schema'
// Services
import { UserService } from '@/modules/user/user.service'

@Controller(EndpointsEnum.USER)
@UseGuards(RoleGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    // GET /users/me
    @Get('me')
    async getMe(
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedUserDocument> {
        const user = await this.userService.findOne(req.user.sub)
        if (!user)
            throw new NotFoundException('Your user profile was not found')
        return user
    }

    // PATCH /users/me
    @Patch('me')
    async updateMe(
        @Req() req: AuthenticatedRequest,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<PopulatedUserDocument> {
        const updatedUser = await this.userService.update(
            req.user.sub,
            updateUserDto
        )
        if (!updatedUser)
            throw new NotFoundException('Your user profile was not found')
        return updatedUser
    }

    // POST /users
    @Post()
    @RequirePermission(PermissionsEnum.USER, 'canWrite')
    async create(
        @Body() createUserDto: CreateUserDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedUserDocument> {
        return this.userService.create(createUserDto, req.user.sub)
    }

    // GET /users
    @Get()
    @RequirePermission(PermissionsEnum.USER, 'canRead')
    async findAll(): Promise<PopulatedUserDocument[]> {
        return this.userService.findAll()
    }

    // GET /users/doctors
    @Get('doctors')
    async findAllDoctors(): Promise<PopulatedUserDocument[]> {
        return this.userService.findAllDoctors()
    }

    // GET /users/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.USER, 'canRead')
    async findOne(@Param('id') id: string): Promise<PopulatedUserDocument> {
        const user = await this.userService.findOne(id)
        if (!user) throw new NotFoundException('User not found')
        return user
    }

    // GET /users/username/:username
    @Get('username/:username')
    @RequirePermission(PermissionsEnum.USER, 'canRead')
    async findByUsername(
        @Param('username') username: string
    ): Promise<PopulatedUserDocument> {
        const user = await this.userService.findByUsername(username)
        if (!user)
            throw new NotFoundException(
                `User with username "${username}" not found`
            )
        return user
    }

    // PATCH /users/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.USER, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<PopulatedUserDocument> {
        const updatedUser = await this.userService.update(id, updateUserDto)
        if (!updatedUser) throw new NotFoundException('User not found')
        return updatedUser
    }

    // PATCH /users/:id/role
    @Patch(':id/role')
    @RequirePermission(PermissionsEnum.USER, 'canWrite')
    async updateRole(
        @Param('id') id: string,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedUserDocument> {
        const updatedUser = await this.userService.updateRole(
            id,
            updateUserRoleDto,
            req.user.sub
        )
        if (!updatedUser) throw new NotFoundException('User profile not found')
        return updatedUser
    }

    // DELETE /users/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.USER, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedUser = await this.userService.remove(id)
        if (!deletedUser) throw new NotFoundException('User not found')
        return { message: 'User deleted successfully' }
    }
}
