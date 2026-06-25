// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { VisitController } from '@/modules/visit/visit.controller'
// Modules
import { UserModule } from '@/modules/user/user.module'
import { RevenueModule } from '@/modules/revenue/revenue.module'
// Schemas
import { Visit, VisitSchema } from '@/modules/visit/schemas/visit.schema'
// Services
import { VisitService } from '@/modules/visit/visit.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
        UserModule,
        forwardRef(() => RevenueModule),
    ],
    controllers: [VisitController],
    providers: [VisitService],
    exports: [VisitService],
})
export class VisitModule {}
