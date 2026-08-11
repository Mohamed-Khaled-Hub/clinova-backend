// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Schemas
import { Visit, VisitSchema } from 'src/modules/visit/schemas/visit.schema'
import {
    Settings,
    SettingsSchema,
} from 'src/modules/settings/schemas/settings.schema'
import { User, UserSchema } from 'src/modules/user/schemas/user.schema'
import {
    Patient,
    PatientSchema,
} from 'src/modules/patient/schemas/patient.schema'
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
    exports: [MedicalDocumentsService],
})
export class MedicalDocumentsModule {}
