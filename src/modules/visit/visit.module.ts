// Core
import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { VisitController } from './visit.controller'
// Modules
import { UserModule } from '../user/user.module'
import { RevenueModule } from '../revenue/revenue.module'
// Schemas
import { Visit, VisitSchema } from './schemas/visit.schema'
// Services
import { VisitService } from './visit.service'

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
