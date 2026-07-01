// Enums
import {
    VisitCategoryEnum,
    ExpenseCategoryEnum,
} from '@/common/enums/schemas.enum'

export interface GetSummaryResponse {
    totalRevenue: number
    totalExpenses: number
    totalDiscounts: number
    netProfit: number
}

export interface GetTimelineResponse {
    period: string
    revenue: number
    expense: number
    netProfit: number
}

export interface GetRevenueByCategoryResponse {
    visitType: VisitCategoryEnum
    revenue: number
    percentage: number
}

export interface GetExpensesByCategoryResponse {
    expenseCategory: ExpenseCategoryEnum
    expense: number
    percentage: number
}
