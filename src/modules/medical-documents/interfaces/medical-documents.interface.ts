// Enums
import { NoteCategoryEnum } from '@/common/enums/schemas.enum'

export interface IClinicContext {
    name: string | null
    clinicAddress: string | null
    clinicPhones: string[]
    logoUrl: string | null
    secondaryLogoUrl: string | null
    watermarkUrl: string | null
    doctorName: string
    specialization: string | null
}

export interface IPatientContext {
    name: string
    age: number
}

export interface IVisitNoteContext {
    category: NoteCategoryEnum
    noteText: string
    contentDate: string | null
    highlightColor: string | null
}

export interface IVisitContext {
    height: number | null
    weight: number | null
    bloodPressure: string | null
    visitDate: string | null
    nextVisitDate: string | null
    notes: IVisitNoteContext[]
}

export interface IAggregatedDocContext {
    language: string
    clinic: IClinicContext
    patient: IPatientContext
    visit: IVisitContext
}
