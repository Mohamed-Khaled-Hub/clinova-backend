// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { VisitController } from '@/modules/visit/visit.controller'
// Schemas
import { Visit, VisitSchema } from '@/modules/visit/schemas/visit.schema'
// Services
import { VisitService } from '@/modules/visit/visit.service'
// Modules
import { UserModule } from '@/modules/user/user.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
        UserModule,
    ],
    controllers: [VisitController],
    providers: [VisitService],
    exports: [VisitService],
})
export class VisitModule {}
