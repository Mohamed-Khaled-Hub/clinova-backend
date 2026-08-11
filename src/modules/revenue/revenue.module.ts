// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RevenueController } from 'src/modules/revenue/revenue.controller'
// Modules
import { VisitModule } from 'src/modules/visit/visit.module'
import { PriceCatalogModule } from 'src/modules/price-catalog/price-catalog.module'
// Schemas
import {
    Revenue,
    RevenueSchema,
} from 'src/modules/revenue/schemas/revenue.schema'
// Services
import { RevenueService } from 'src/modules/revenue/revenue.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Revenue.name, schema: RevenueSchema },
        ]),
        forwardRef(() => VisitModule),
        PriceCatalogModule,
    ],
    controllers: [RevenueController],
    providers: [RevenueService],
    exports: [RevenueService],
})
export class RevenueModule {}
