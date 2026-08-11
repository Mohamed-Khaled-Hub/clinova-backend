// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { VisitController } from 'src/modules/visit/visit.controller'
// Modules
import { UserModule } from 'src/modules/user/user.module'
import { RevenueModule } from 'src/modules/revenue/revenue.module'
// Schemas
import { Visit, VisitSchema } from 'src/modules/visit/schemas/visit.schema'
// Services
import { VisitService } from 'src/modules/visit/visit.service'

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
