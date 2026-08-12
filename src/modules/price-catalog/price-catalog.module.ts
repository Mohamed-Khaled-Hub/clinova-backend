// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PriceCatalogController } from './price-catalog.controller'
// Schemas
import {
    PriceCatalog,
    PriceCatalogSchema,
} from './schemas/price-catalog.schema'
// Services
import { PriceCatalogService } from './price-catalog.service'
import { PriceCatalogSeederService } from './price-catalog-seeder.service'

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
