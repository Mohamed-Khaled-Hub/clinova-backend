// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PatientController } from './patient.controller'
// Schemas
import { Patient, PatientSchema } from './schemas/patient.schema'
// Services
import { PatientService } from './patient.service'

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
