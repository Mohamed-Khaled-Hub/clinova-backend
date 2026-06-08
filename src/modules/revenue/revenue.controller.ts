// Core
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreateRevenueDto } from '@/modules/revenue/dto/create-revenue.dto'
import { UpdateRevenueDto } from '@/modules/revenue/dto/update-revenue.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import type { AuthenticatedRequest } from '@/modules/auth/interfaces/auth.interface'
import { MessageResponse } from '@/common/interfaces/response.interface'
// Schemas
import { PopulatedRevenueDocument } from '@/modules/revenue/schemas/revenue.schema'
// Services
import { RevenueService } from '@/modules/revenue/revenue.service'

@Controller(EndpointsEnum.REVENUE)
@UseGuards(RoleGuard)
export class RevenueController {
    constructor(private readonly revenueService: RevenueService) {}

    // POST /revenues
    @Post()
    @RequirePermission(PermissionsEnum.REVENUE, 'canWrite')
    async create(
        @Body() createRevenueDto: CreateRevenueDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedRevenueDocument> {
        return this.revenueService.create(createRevenueDto, req.user.sub)
    }

    // GET /revenues
    @Get()
    @RequirePermission(PermissionsEnum.REVENUE, 'canRead')
    async findAll(): Promise<PopulatedRevenueDocument[]> {
        return this.revenueService.findAll()
    }

    // GET /revenues/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.REVENUE, 'canRead')
    async findOne(@Param('id') id: string): Promise<PopulatedRevenueDocument> {
        const record = await this.revenueService.findOne(id)
        if (!record) throw new NotFoundException('Revenue record not found')
        return record
    }

    // GET /revenues/visit/:visitId
    @Get('visit/:visitId')
    @RequirePermission(PermissionsEnum.REVENUE, 'canRead')
    async findByVisit(
        @Param('visitId') visitId: string
    ): Promise<PopulatedRevenueDocument> {
        const record = await this.revenueService.findByVisit(visitId)
        if (!record) throw new NotFoundException('Revenue record not found')
        return record
    }

    // PATCH /revenues/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.REVENUE, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updateRevenueDto: UpdateRevenueDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedRevenueDocument> {
        const updatedRecord = await this.revenueService.update(
            id,
            updateRevenueDto,
            req.user.sub
        )
        if (!updatedRecord)
            throw new NotFoundException('Revenue record not found')
        return updatedRecord
    }

    // DELETE /revenues/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.REVENUE, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedRecord = await this.revenueService.remove(id)
        if (!deletedRecord)
            throw new NotFoundException('Revenue record not found')
        return { message: 'Revenue record deleted successfully' }
    }
}
