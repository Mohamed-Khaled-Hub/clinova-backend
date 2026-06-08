// Core
import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
// Enums
import { VisitCategoryEnum } from '@/common/enums/schemas.enum'
// Schemas
import { PriceCatalog } from '@/modules/price-catalog/schemas/price-catalog.schema'
// Services
import { PriceCatalogService } from '@/modules/price-catalog/price-catalog.service'

@Injectable()
export class PriceCatalogSeederService implements OnModuleInit {
    private readonly logger = new Logger(PriceCatalogSeederService.name)

    constructor(private readonly priceCatalogService: PriceCatalogService) {}

    async onModuleInit() {
        this.logger.log('Checking price catalog database seed status...')
        const existingCatalogs = await this.priceCatalogService.findAll()
        if (existingCatalogs && existingCatalogs.length > 0) {
            this.logger.debug(
                'Database price catalogs are already initialized. Skipping price catalog seeder lifecycle.'
            )
            return
        }

        this.logger.log('Executing price catalog database seeds...')
        await this.seedPriceCatalog()
    }

    private async seedPriceCatalog(): Promise<void> {
        const allCatalogsInDb = await this.priceCatalogService.findAll()

        const catalogSeeds: Array<Omit<PriceCatalog, 'customFields'>> = [
            {
                visitType: VisitCategoryEnum.EXAMINATION,
                basePrice: 300,
                isPriceFlexible: false,
            },
            {
                visitType: VisitCategoryEnum.CONSULTATION,
                basePrice: 50,
                isPriceFlexible: false,
            },
            {
                visitType: VisitCategoryEnum.LAB_REVIEW,
                basePrice: 0,
                isPriceFlexible: true,
            },
            {
                visitType: VisitCategoryEnum.OTHER,
                basePrice: 0,
                isPriceFlexible: true,
            },
        ]

        for (const seed of catalogSeeds) {
            const existingCatalog = allCatalogsInDb.find(
                (c) => String(c.visitType) === String(seed.visitType)
            )

            if (existingCatalog) {
                this.logger.debug(
                    `Price catalog entry for "${seed.visitType}" already exists. Skipping...`
                )
                continue
            }

            await this.priceCatalogService.create({
                visitType: seed.visitType,
                basePrice: seed.basePrice,
                isPriceFlexible: seed.isPriceFlexible,
            })

            this.logger.log(
                `Price catalog configured successfully: "${seed.visitType}" -> Price: ${seed.basePrice} (Flexible: ${seed.isPriceFlexible})`
            )
        }
    }
}
