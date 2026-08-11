// Core
import { Controller, Get, Param, UseGuards } from '@nestjs/common'
// Decorators
import { RequirePermission } from 'src/modules/permission/decorators/permission.decorator'
// Enums
import { PermissionsEnum } from 'src/common/enums/roles-permissions.enum'
import { EndpointsEnum } from 'src/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from 'src/modules/role/guards/role.guard'
// Services
import { MedicalDocumentsService } from './medical-documents.service'
// Types
import {
    PrescriptionData,
    LabRequestData,
    RadiologyRequestData,
} from 'src/modules/medical-documents/types/medical-document.type'

@Controller(EndpointsEnum.MEDICAL_DOCUMENTS || 'medical-documents')
@UseGuards(RoleGuard)
export class MedicalDocumentsController {
    constructor(
        private readonly medicalDocumentsService: MedicalDocumentsService
    ) {}

    // GET /medical-documents/prescription/:visitId
    @Get('prescription/:visitId')
    @RequirePermission(PermissionsEnum.MEDICAL_DOCUMENTS, 'canRead')
    async getPrescription(
        @Param('visitId') visitId: string
    ): Promise<PrescriptionData> {
        return await this.medicalDocumentsService.getPrescription(visitId)
    }

    // GET /medical-documents/lab-request/:visitId
    @Get('lab-request/:visitId')
    @RequirePermission(PermissionsEnum.MEDICAL_DOCUMENTS, 'canRead')
    async getLabRequest(
        @Param('visitId') visitId: string
    ): Promise<LabRequestData> {
        return await this.medicalDocumentsService.getLabRequest(visitId)
    }

    // GET /medical-documents/radiology-request/:visitId
    @Get('radiology-request/:visitId')
    @RequirePermission(PermissionsEnum.MEDICAL_DOCUMENTS, 'canRead')
    async getRadiologyRequest(
        @Param('visitId') visitId: string
    ): Promise<RadiologyRequestData> {
        return await this.medicalDocumentsService.getRadiologyRequest(visitId)
    }
}
