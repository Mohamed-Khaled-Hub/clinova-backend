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
import { RequirePermission } from 'src/modules/permission/decorators/permission.decorator'
// DTOs
import { CreatePatientDto } from 'src/modules/patient/dto/create-patient.dto'
import { UpdatePatientDto } from 'src/modules/patient/dto/update-patient.dto'
// Enums
import { PermissionsEnum } from 'src/common/enums/roles-permissions.enum'
import { EndpointsEnum } from 'src/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from 'src/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from 'src/common/interfaces/response.interface'
// Schemas
import { PatientDocument } from 'src/modules/patient/schemas/patient.schema'
// Services
import { PatientService } from 'src/modules/patient/patient.service'

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

    // GET /patients/by-date?date=YYYY-MM-DD
    @Get('by-date')
    @RequirePermission(PermissionsEnum.PATIENT, 'canRead')
    async findByDate(@Query('date') date: string): Promise<PatientDocument[]> {
        return this.patientService.findByDate(date)
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
