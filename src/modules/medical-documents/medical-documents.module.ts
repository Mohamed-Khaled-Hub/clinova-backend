// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Schemas
import { Visit, VisitSchema } from '@/modules/visit/schemas/visit.schema'
import {
    Settings,
    SettingsSchema,
} from '@/modules/settings/schemas/settings.schema'
import { User, UserSchema } from '@/modules/user/schemas/user.schema'
import {
    Patient,
    PatientSchema,
} from '@/modules/patient/schemas/patient.schema'
// Services
import { MedicalDocumentsService } from './medical-documents.service'
// Controllers
import { MedicalDocumentsController } from './medical-documents.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Visit.name, schema: VisitSchema },
            { name: Settings.name, schema: SettingsSchema },
            { name: User.name, schema: UserSchema },
            { name: Patient.name, schema: PatientSchema },
        ]),
    ],
    providers: [MedicalDocumentsService],
    controllers: [MedicalDocumentsController],
})
export class MedicalDocumentsModule {}
