// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PatientController } from '@/modules/patient/patient.controller'
// Schemas
import {
    Patient,
    PatientSchema,
} from '@/modules/patient/schemas/patient.schema'
// Services
import { PatientService } from '@/modules/patient/patient.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Patient.name, schema: PatientSchema },
        ]),
    ],
    controllers: [PatientController],
    providers: [PatientService],
    exports: [PatientService],
})
export class PatientModule {}
