// Core
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreatePriceCatalogDto } from '@/modules/price-catalog/dto/create-price-catalog.dto'
import { UpdatePriceCatalogDto } from '@/modules/price-catalog/dto/update-price-catalog.dto'
// Enums
import { VisitCategoryEnum } from '@/common/enums/schemas.enum'
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import {
    MessageResponse,
    PriceResponse,
} from '@/common/interfaces/response.interface'
// Schemas
import { PriceCatalogDocument } from '@/modules/price-catalog/schemas/price-catalog.schema'
// Services
import { PriceCatalogService } from '@/modules/price-catalog/price-catalog.service'

@Controller(EndpointsEnum.PRICE_CATALOG)
@UseGuards(RoleGuard)
export class PriceCatalogController {
    constructor(private readonly priceCatalogService: PriceCatalogService) {}

    // POST /price-catalog
    @Post()
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canWrite')
    async create(
        @Body() createPriceCatalogDto: CreatePriceCatalogDto
    ): Promise<PriceCatalogDocument> {
        return this.priceCatalogService.create(createPriceCatalogDto)
    }

    // GET /price-catalog
    @Get()
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canRead')
    async findAll(): Promise<PriceCatalogDocument[]> {
        return this.priceCatalogService.findAll()
    }

    // GET /price-catalog/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canRead')
    async findOne(@Param('id') id: string): Promise<PriceCatalogDocument> {
        const catalog = await this.priceCatalogService.findOne(id)
        if (!catalog)
            throw new NotFoundException('Price catalog record not found')
        return catalog
    }

    // GET /price-catalog/type/:visitType
    @Get('type/:visitType')
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canRead')
    async findByVisitType(
        @Param('visitType') visitType: VisitCategoryEnum
    ): Promise<PriceCatalogDocument> {
        const catalog =
            await this.priceCatalogService.findByVisitType(visitType)
        if (!catalog)
            throw new NotFoundException(
                `Price catalog for type "${visitType}" not found`
            )
        return catalog
    }

    // GET /price-catalog/price/:visitType
    @Get('price/:visitType')
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canRead')
    async getPriceValue(
        @Param('visitType') visitType: VisitCategoryEnum
    ): Promise<PriceResponse> {
        const price =
            await this.priceCatalogService.getPriceByVisitType(visitType)
        if (price === null) {
            throw new NotFoundException(
                `No price configuration mapped for visit type "${visitType}"`
            )
        }
        return { price }
    }

    // PATCH /price-catalog/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updatePriceCatalogDto: UpdatePriceCatalogDto
    ): Promise<PriceCatalogDocument> {
        const updatedCatalog = await this.priceCatalogService.update(
            id,
            updatePriceCatalogDto
        )
        if (!updatedCatalog)
            throw new NotFoundException('Price catalog record not found')
        return updatedCatalog
    }

    // DELETE /price-catalog/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.PRICE_CATALOG, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedCatalog = await this.priceCatalogService.remove(id)
        if (!deletedCatalog)
            throw new NotFoundException('Price catalog record not found')
        return { message: 'Price catalog record deleted successfully' }
    }
}
