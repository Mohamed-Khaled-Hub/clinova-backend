// Enums
import { NoteCategoryEnum } from '@/common/enums/schemas.enum'
// Interfaces
import { MedicalDocumentsData } from '@/modules/medical-documents/interfaces/medical-documents.interface'

export type PrescriptionData = MedicalDocumentsData<
    NoteCategoryEnum.PRESCRIBED_MEDICATIONS | NoteCategoryEnum.DIAGNOSIS
>

export type LabRequestData = MedicalDocumentsData<
    NoteCategoryEnum.REQUESTED_LAB_TESTS | NoteCategoryEnum.DIAGNOSIS
>

export type RadiologyRequestData = MedicalDocumentsData<
    | NoteCategoryEnum.REQUESTED_RADIOLOGY
    | NoteCategoryEnum.COMPLAINT
    | NoteCategoryEnum.HISTORY
    | NoteCategoryEnum.DIAGNOSIS
>
