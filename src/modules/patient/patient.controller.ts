// Core
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreatePatientDto } from '@/modules/patient/dto/create-patient.dto'
import { UpdatePatientDto } from '@/modules/patient/dto/update-patient.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
// Schemas
import { PatientDocument } from '@/modules/patient/schemas/patient.schema'
// Services
import { PatientService } from '@/modules/patient/patient.service'

@Controller(EndpointsEnum.PATIENT)
@UseGuards(RoleGuard)
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    // POST /patients
    @Post()
    @RequirePermission(PermissionsEnum.PATIENT, 'canWrite')
    async create(
        @Body() createPatientDto: CreatePatientDto
    ): Promise<PatientDocument> {
        return this.patientService.create(createPatientDto)
    }

    // GET /patients
    @Get()
    @RequirePermission(PermissionsEnum.PATIENT, 'canRead')
    async findAll(): Promise<PatientDocument[]> {
        return this.patientService.findAll()
    }

    // GET /patients/search?term=...
    @Get('search')
    @RequirePermission(PermissionsEnum.PATIENT, 'canRead')
    async search(@Query('term') term: string): Promise<PatientDocument[]> {
        return this.patientService.search(term)
    }

    // GET /patients/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.PATIENT, 'canRead')
    async findOne(@Param('id') id: string): Promise<PatientDocument> {
        const patient = await this.patientService.findOne(id)
        if (!patient) throw new NotFoundException('Patient record not found')
        return patient
    }

    // PATCH /patients/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.PATIENT, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updatePatientDto: UpdatePatientDto
    ): Promise<PatientDocument> {
        const updatedPatient = await this.patientService.update(
            id,
            updatePatientDto
        )
        if (!updatedPatient)
            throw new NotFoundException('Patient record not found')
        return updatedPatient
    }

    // DELETE /patients/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.PATIENT, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedPatient = await this.patientService.remove(id)
        if (!deletedPatient)
            throw new NotFoundException('Patient record not found')
        return { message: 'Patient profile deleted successfully' }
    }
}
