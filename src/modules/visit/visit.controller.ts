// Core
import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Patch,
    Query,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreateVisitDto } from '@/modules/visit/dto/create-visit.dto'
import { UpdateVisitDto } from '@/modules/visit/dto/update-visit.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
// Schemas
import { PopulatedVisitDocument } from '@/modules/visit/schemas/visit.schema'
// Services
import { VisitService } from '@/modules/visit/visit.service'

@Controller(EndpointsEnum.VISIT)
@UseGuards(RoleGuard)
export class VisitController {
    constructor(private readonly visitService: VisitService) {}

    // POST /visits
    @Post()
    @RequirePermission(PermissionsEnum.VISIT, 'canWrite')
    async create(
        @Body() createVisitDto: CreateVisitDto
    ): Promise<PopulatedVisitDocument> {
        return this.visitService.create(createVisitDto)
    }

    // GET /visits
    @Get()
    @RequirePermission(PermissionsEnum.VISIT, 'canRead')
    async findAll(): Promise<PopulatedVisitDocument[]> {
        return this.visitService.findAll()
    }

    // GET /visits/notes/suggestions?search=...
    @Get('notes/suggestions')
    @RequirePermission(PermissionsEnum.VISIT, 'canRead')
    async getNoteSuggestions(
        @Query('search') search?: string
    ): Promise<string[]> {
        return this.visitService.getNoteSuggestions(search)
    }

    // GET /visits/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.VISIT, 'canRead')
    async findOne(@Param('id') id: string): Promise<PopulatedVisitDocument> {
        const visit = await this.visitService.findOne(id)
        if (!visit) throw new NotFoundException(`Visit not found`)
        return visit
    }

    // GET /visits/patient/:patientId
    @Get('patient/:patientId')
    @RequirePermission(PermissionsEnum.VISIT, 'canRead')
    async findByPatient(
        @Param('patientId') patientId: string
    ): Promise<PopulatedVisitDocument[]> {
        return this.visitService.findByPatient(patientId)
    }

    // PATCH /visits/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.VISIT, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateVisitDto
    ): Promise<PopulatedVisitDocument> {
        const updatedVisit = await this.visitService.update(id, dto)
        if (!updatedVisit) throw new NotFoundException(`Visit not found`)
        return updatedVisit
    }

    // DELETE /visits/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.VISIT, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedVisit = await this.visitService.remove(id)
        if (!deletedVisit) throw new NotFoundException(`Visit not found`)
        return { message: 'Visit deleted successfully' }
    }
}
