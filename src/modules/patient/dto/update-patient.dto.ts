// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreatePatientDto } from './create-patient.dto'

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
