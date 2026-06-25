// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RevenueController } from '@/modules/revenue/revenue.controller'
// Modules
import { VisitModule } from '@/modules/visit/visit.module'
import { PriceCatalogModule } from '@/modules/price-catalog/price-catalog.module'
// Schemas
import {
    Revenue,
    RevenueSchema,
} from '@/modules/revenue/schemas/revenue.schema'
// Services
import { RevenueService } from '@/modules/revenue/revenue.service'

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
