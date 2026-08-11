// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreatePatientDto } from 'src/modules/patient/dto/create-patient.dto'

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
