// Core
import { PartialType, OmitType } from '@nestjs/swagger'
// DTOs
import { CreatePriceCatalogDto } from 'src/modules/price-catalog/dto/create-price-catalog.dto'

export class UpdatePriceCatalogDto extends PartialType(
    OmitType(CreatePriceCatalogDto, ['visitType'] as const)
) {}
