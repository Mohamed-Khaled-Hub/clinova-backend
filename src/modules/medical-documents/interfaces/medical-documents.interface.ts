// Enums
import { NoteCategoryEnum } from '@/common/enums/schemas.enum'

export interface MedicalDocumentsData<
    T extends NoteCategoryEnum = NoteCategoryEnum,
> {
    language: string
    clinic: {
        name: string | null
        clinicAddress: string | null
        clinicPhones: string[]
        logoUrl: string | null
        secondaryLogoUrl: string | null
        watermarkUrl: string | null
        doctorName: string
        specialization: string | null
    }
    patient: {
        name: string
        age: number
    }
    visit: {
        height: number | null
        weight: number | null
        bloodPressure: string | null
        visitDate: string | null
        nextVisitDate: string | null
        notes: {
            category: T
            noteText: string
            contentDate: string | null
            highlightColor: string | null
        }[]
    }
}
