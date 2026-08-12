// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RevenueController } from './revenue.controller'
// Modules
import { VisitModule } from '../visit/visit.module'
import { PriceCatalogModule } from '../price-catalog/price-catalog.module'
// Schemas
import { Revenue, RevenueSchema } from './schemas/revenue.schema'
// Services
import { RevenueService } from './revenue.service'

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
