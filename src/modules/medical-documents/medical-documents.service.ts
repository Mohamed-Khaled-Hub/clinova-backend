// Core
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
// Enums
import { LangEnum, NoteCategoryEnum } from '../../common/enums/schemas.enum'
// Interfaces
import { MedicalDocumentsData } from './interfaces/medical-documents.interface'
// Schemas
import { Visit, VisitDocument } from '../visit/schemas/visit.schema'
import {
    Settings,
    SETTINGS_ID,
    SettingsDocument,
} from '../settings/schemas/settings.schema'
import { User, UserDocument } from '../user/schemas/user.schema'
import { Patient, PatientDocument } from '../patient/schemas/patient.schema'
// Types
import {
    LabRequestData,
    PrescriptionData,
    RadiologyRequestData,
} from './types/medical-document.type'

@Injectable()
export class MedicalDocumentsService {
    private readonly SETTINGS_ID = SETTINGS_ID

    constructor(
        @InjectModel(Visit.name)
        private readonly visitModel: Model<VisitDocument>,
        @InjectModel(Settings.name)
        private readonly settingsModel: Model<SettingsDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectModel(Patient.name)
        private readonly patientModel: Model<PatientDocument>
    ) {}

    // Helpers
    private calculateAge(dob: Date): number {
        const birthDate = new Date(dob)
        const today = new Date()

        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--
        }
        return age >= 0 ? age : 0
    }

    private formatDate(
        date: Date | null | undefined,
        isArabic: boolean,
        format: 'full' | 'dateOnly' | 'timeOnly' = 'full'
    ): string | null {
        if (!date) return null

        const config: Intl.DateTimeFormatOptions = {}

        if (format === 'full' || format === 'dateOnly') {
            config.year = 'numeric'
            config.month = 'long'
            config.day = 'numeric'
        }

        if (format === 'full' || format === 'timeOnly') {
            config.hour = '2-digit'
            config.minute = '2-digit'
        }

        return new Date(date).toLocaleString(
            isArabic ? 'ar-EG' : 'en-US',
            config
        )
    }

    private async getAggregatedContext<T extends NoteCategoryEnum>(
        visitId: string,
        targetCategories?: NoteCategoryEnum[]
    ): Promise<MedicalDocumentsData<T>> {
        const settings = await this.settingsModel
            .findById(this.SETTINGS_ID)
            .lean()
            .exec()
        if (!settings)
            throw new NotFoundException('Global settings profile not found')

        const isArabic = settings.primaryLanguage === LangEnum.AR

        const visit = await this.visitModel.findById(visitId).lean().exec()
        if (!visit) throw new NotFoundException('Visit records not found')

        const patient = await this.patientModel
            .findById(visit.patientId)
            .lean()
            .exec()
        if (!patient)
            throw new NotFoundException('Associated patient profile not found')

        const doctor = await this.userModel
            .findById(visit.doctorId)
            .lean()
            .exec()
        if (!doctor)
            throw new NotFoundException(
                'Associated healthcare provider not found'
            )

        let rawNotes = visit.notes ?? []
        if (targetCategories && targetCategories.length > 0) {
            rawNotes = rawNotes.filter((note) =>
                targetCategories.includes(note.category)
            )
        }

        return {
            language: settings.primaryLanguage.toLowerCase(),
            clinic: {
                name:
                    (isArabic
                        ? settings.clinicNameAr
                        : settings.clinicNameEn) || null,
                clinicAddress: settings.clinicAddress ?? null,
                clinicPhones: settings.clinicPhones,
                logoUrl: settings.logoUrl ?? null,
                secondaryLogoUrl: settings.secondaryLogoUrl ?? null,
                watermarkUrl: settings.watermarkUrl ?? null,
                doctorName:
                    (isArabic ? doctor.fullNameAr : doctor.fullNameEn) ||
                    doctor.username,
                specialization:
                    (isArabic
                        ? doctor.specializationAr
                        : doctor.specializationEn) || null,
            },
            patient: {
                name: isArabic ? patient.fullNameAr : patient.fullNameEn,
                age: this.calculateAge(patient.dob),
            },
            visit: {
                height: visit.height ?? null,
                weight: visit.weight ?? null,
                bloodPressure: visit.bloodPressure ?? null,
                visitDate: this.formatDate(
                    visit.visitDate,
                    isArabic,
                    'dateOnly'
                ),
                nextVisitDate: this.formatDate(
                    visit.nextVisitDate,
                    isArabic,
                    'dateOnly'
                ),
                notes: rawNotes.map((note) => ({
                    category: note.category as T,
                    noteText: note.noteText,
                    contentDate: this.formatDate(
                        note.contentDate,
                        isArabic,
                        'dateOnly'
                    ),
                    highlightColor: note.highlightColor ?? null,
                })),
            },
        }
    }

    async getPrescription(visitId: string): Promise<PrescriptionData> {
        return await this.getAggregatedContext(visitId, [
            NoteCategoryEnum.PRESCRIBED_MEDICATIONS,
            NoteCategoryEnum.DIAGNOSIS,
        ])
    }

    async getLabRequest(visitId: string): Promise<LabRequestData> {
        return await this.getAggregatedContext(visitId, [
            NoteCategoryEnum.REQUESTED_LAB_TESTS,
            NoteCategoryEnum.DIAGNOSIS,
        ])
    }

    async getRadiologyRequest(visitId: string): Promise<RadiologyRequestData> {
        return await this.getAggregatedContext(visitId, [
            NoteCategoryEnum.REQUESTED_RADIOLOGY,
            NoteCategoryEnum.COMPLAINT,
            NoteCategoryEnum.HISTORY,
            NoteCategoryEnum.DIAGNOSIS,
        ])
    }
}
