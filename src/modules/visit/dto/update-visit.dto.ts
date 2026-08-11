// Core
import { PartialType, OmitType } from '@nestjs/swagger'
// DTOs
import { CreateVisitDto } from 'src/modules/visit/dto/create-visit.dto'

export class UpdateVisitDto extends PartialType(
    OmitType(CreateVisitDto, ['patientId', 'doctorId'] as const)
) {}
