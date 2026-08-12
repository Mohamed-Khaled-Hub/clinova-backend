// Core
import { PartialType, OmitType } from '@nestjs/swagger'
// DTOs
import { CreatePriceCatalogDto } from './create-price-catalog.dto'

export class UpdatePriceCatalogDto extends PartialType(
    OmitType(CreatePriceCatalogDto, ['visitType'] as const)
) {}
