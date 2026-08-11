// Core
import { PartialType, OmitType } from '@nestjs/swagger'
// DTOs
import { CreateRevenueDto } from 'src/modules/revenue/dto/create-revenue.dto'

export class UpdateRevenueDto extends PartialType(
    OmitType(CreateRevenueDto, ['visitId'] as const)
) {}
