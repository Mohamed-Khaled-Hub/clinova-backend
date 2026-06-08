// Core
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// Schemas
import {
    PriceCatalog,
    PriceCatalogDocument,
} from '@/modules/price-catalog/schemas/price-catalog.schema'
// DTOs
import { CreatePriceCatalogDto } from '@/modules/price-catalog/dto/create-price-catalog.dto'
import { UpdatePriceCatalogDto } from '@/modules/price-catalog/dto/update-price-catalog.dto'
// Enums
import { VisitCategoryEnum } from '@/common/enums/schemas.enum'

@Injectable()
export class PriceCatalogService {
    constructor(
        @InjectModel(PriceCatalog.name)
        private readonly priceCatalogModel: Model<PriceCatalogDocument>
    ) {}

    // POST /price-catalogs
    async create(
        createPriceCatalogDto: CreatePriceCatalogDto
    ): Promise<PriceCatalogDocument> {
        const createdCatalog = new this.priceCatalogModel(createPriceCatalogDto)
        return await createdCatalog.save()
    }

    // GET /price-catalogs
    async findAll(): Promise<PriceCatalogDocument[]> {
        return this.priceCatalogModel.find().exec()
    }

    // GET /price-catalogs/:id
    async findOne(id: string): Promise<PriceCatalogDocument | null> {
        return this.priceCatalogModel.findById(id).exec()
    }

    // GET /price-catalogs/type/:visitType
    async findByVisitType(
        visitType: VisitCategoryEnum
    ): Promise<PriceCatalogDocument | null> {
        return this.priceCatalogModel.findOne({ visitType }).exec()
    }

    // GET /price-catalogs/price/:visitType
    async getPriceByVisitType(
        visitType: VisitCategoryEnum
    ): Promise<number | null> {
        const catalog = await this.priceCatalogModel
            .findOne({ visitType })
            .exec()
        return catalog ? catalog.basePrice : null
    }

    // PATCH /price-catalogs/:id
    async update(
        id: string,
        updatePriceCatalogDto: UpdatePriceCatalogDto
    ): Promise<PriceCatalogDocument | null> {
        const existingCatalog = await this.priceCatalogModel.findById(id).exec()
        if (!existingCatalog) {
            throw new NotFoundException(`Price catalog entry not found.`)
        }

        if (
            !existingCatalog.isPriceFlexible &&
            updatePriceCatalogDto.basePrice !== undefined
        ) {
            if (updatePriceCatalogDto.basePrice !== existingCatalog.basePrice) {
                throw new BadRequestException(
                    `Cannot update base price. Price modifications are locked for the "${existingCatalog.visitType}" catalog category.`
                )
            }
        }

        return this.priceCatalogModel
            .findByIdAndUpdate(id, updatePriceCatalogDto, {
                returnDocument: 'after',
            })
            .exec()
    }

    // DELETE /price-catalogs/:id
    async remove(id: string): Promise<PriceCatalogDocument | null> {
        return this.priceCatalogModel.findByIdAndDelete(id).exec()
    }
}
