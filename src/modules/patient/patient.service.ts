// Core
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// Schemas
import {
    Patient,
    PatientDocument,
} from '@/modules/patient/schemas/patient.schema'
// DTOs
import { CreatePatientDto } from '@/modules/patient/dto/create-patient.dto'
import { UpdatePatientDto } from '@/modules/patient/dto/update-patient.dto'

@Injectable()
export class PatientService {
    constructor(
        @InjectModel(Patient.name)
        private readonly patientModel: Model<PatientDocument>
    ) {}

    // POST /patients
    async create(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
        const createdPatient = new this.patientModel(createPatientDto)
        return await createdPatient.save()
    }

    // GET /patients
    async findAll(): Promise<PatientDocument[]> {
        return this.patientModel.find().exec()
    }

    // GET /patients/search?term=...
    async search(term: string): Promise<PatientDocument[]> {
        const searchRegex = new RegExp(term, 'i')

        return this.patientModel
            .find({
                $or: [
                    { fullNameEn: searchRegex },
                    { fullNameAr: searchRegex },
                    { phone: searchRegex },
                ],
            })
            .exec()
    }

    // GET /patients/:id
    async findOne(id: string): Promise<PatientDocument | null> {
        return this.patientModel.findById(id).exec()
    }

    // PATCH /patients/:id
    async update(
        id: string,
        updatePatientDto: UpdatePatientDto
    ): Promise<PatientDocument | null> {
        return this.patientModel
            .findByIdAndUpdate(id, updatePatientDto, {
                returnDocument: 'after',
            })
            .exec()
    }

    // DELETE /patients/:id
    async remove(id: string): Promise<PatientDocument | null> {
        return this.patientModel.findByIdAndDelete(id).exec()
    }
}
