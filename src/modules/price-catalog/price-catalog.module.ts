// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PriceCatalogController } from '@/modules/price-catalog/price-catalog.controller'
// Schemas
import {
    PriceCatalog,
    PriceCatalogSchema,
} from '@/modules/price-catalog/schemas/price-catalog.schema'
// Services
import { PriceCatalogService } from '@/modules/price-catalog/price-catalog.service'
import { PriceCatalogSeederService } from '@/modules/price-catalog/price-catalog-seeder.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PriceCatalog.name, schema: PriceCatalogSchema },
        ]),
    ],
    controllers: [PriceCatalogController],
    providers: [PriceCatalogService, PriceCatalogSeederService],
    exports: [PriceCatalogService],
})
export class PriceCatalogModule {}
