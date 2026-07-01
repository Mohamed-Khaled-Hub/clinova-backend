// Core
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// Enums
import {
    ExpenseCategoryEnum,
    FinancialStatusEnum,
    VisitCategoryEnum,
} from '@/common/enums/schemas.enum'
import { IntervalEnum } from '@/modules/finance/enums/finance.enum'
// Interfaces
import {
    GetSummaryResponse,
    GetTimelineResponse,
    GetRevenueByCategoryResponse,
    GetExpensesByCategoryResponse,
} from '@/modules/finance/interfaces/finance.responses.interface'
// Schemas
import {
    Revenue,
    RevenueDocument,
} from '@/modules/revenue/schemas/revenue.schema'
import {
    Expense,
    ExpenseDocument,
} from '@/modules/expense/schemas/expense.schema'

@Injectable()
export class FinanceService {
    constructor(
        @InjectModel(Revenue.name)
        private readonly revenueModel: Model<RevenueDocument>,
        @InjectModel(Expense.name)
        private readonly expenseModel: Model<ExpenseDocument>
    ) {}

    // GET /finance/summary
    async getSummary(
        startDate: string,
        endDate: string
    ): Promise<GetSummaryResponse> {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException(
                'Invalid date format provided. Use YYYY-MM-DD.'
            )
        }

        const revenueAgg = await this.revenueModel
            .aggregate<
                Pick<GetSummaryResponse, 'totalRevenue' | 'totalDiscounts'>
            >([
                {
                    $match: {
                        transactionDate: { $gte: start, $lte: end },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$finalAmount' },
                        totalDiscounts: { $sum: '$discountAmount' },
                    },
                },
            ])
            .exec()

        const expenseAgg = await this.expenseModel
            .aggregate<Pick<GetSummaryResponse, 'totalExpenses'>>([
                {
                    $match: {
                        expenseDate: { $gte: start, $lte: end },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalExpenses: { $sum: '$expenseAmount' },
                    },
                },
            ])
            .exec()

        const totalRevenue = revenueAgg[0]?.totalRevenue ?? 0
        const totalDiscounts = revenueAgg[0]?.totalDiscounts ?? 0
        const totalExpenses = expenseAgg[0]?.totalExpenses ?? 0
        const netProfit = totalRevenue - totalExpenses

        return {
            totalRevenue,
            totalExpenses,
            totalDiscounts,
            netProfit,
        }
    }

    // GET /finance/timeline
    async getTimeline(
        interval: IntervalEnum,
        year: number
    ): Promise<GetTimelineResponse[]> {
        const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0)
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)

        let groupExpression: Record<string, unknown>
        if (interval === IntervalEnum.MONTHLY) {
            groupExpression = { $dateToString: { format: '%b', date: '$date' } }
        } else if (interval === IntervalEnum.WEEKLY) {
            groupExpression = {
                $concat: [
                    'Week ',
                    { $dateToString: { format: '%U', date: '$date' } },
                ],
            }
        } else {
            groupExpression = {
                $dateToString: { format: '%Y-%m-%d', date: '$date' },
            }
        }

        const revenueData = await this.revenueModel
            .aggregate<{ _id: string; total: number }>([
                {
                    $match: {
                        transactionDate: { $gte: startOfYear, $lte: endOfYear },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $project: {
                        date: '$transactionDate',
                        amount: '$finalAmount',
                    },
                },
                {
                    $group: {
                        _id: groupExpression,
                        total: { $sum: '$amount' },
                    },
                },
            ])
            .exec()

        const expenseData = await this.expenseModel
            .aggregate<{ _id: string; total: number }>([
                {
                    $match: {
                        expenseDate: { $gte: startOfYear, $lte: endOfYear },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $project: {
                        date: '$expenseDate',
                        amount: '$expenseAmount',
                    },
                },
                {
                    $group: {
                        _id: groupExpression,
                        total: { $sum: '$amount' },
                    },
                },
            ])
            .exec()

        const timelineMap = new Map<
            string,
            Omit<GetTimelineResponse, 'period'>
        >()

        if (interval === IntervalEnum.MONTHLY) {
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ]
            months.forEach((m) =>
                timelineMap.set(m, { revenue: 0, expense: 0, netProfit: 0 })
            )
        }

        revenueData.forEach((item) => {
            const existing = timelineMap.get(item._id) ?? {
                revenue: 0,
                expense: 0,
                netProfit: 0,
            }
            existing.revenue = item.total
            timelineMap.set(item._id, existing)
        })

        expenseData.forEach((item) => {
            const existing = timelineMap.get(item._id) ?? {
                revenue: 0,
                expense: 0,
                netProfit: 0,
            }
            existing.expense = item.total
            timelineMap.set(item._id, existing)
        })

        const result: GetTimelineResponse[] = Array.from(
            timelineMap.entries()
        ).map(([period, data]) => ({
            period,
            revenue: data.revenue,
            expense: data.expense,
            netProfit: data.revenue - data.expense,
        }))

        if (interval !== IntervalEnum.MONTHLY) {
            result.sort((a, b) => a.period.localeCompare(b.period))
        }

        return result
    }

    // GET /finance/revenue-by-category
    async getRevenueByCategory(
        startDate: string,
        endDate: string
    ): Promise<GetRevenueByCategoryResponse[]> {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException(
                'Invalid date format provided. Use YYYY-MM-DD.'
            )
        }

        const rawData = await this.revenueModel
            .aggregate<{ _id: string; revenue: number }>([
                {
                    $match: {
                        transactionDate: { $gte: start, $lte: end },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $lookup: {
                        from: 'visits',
                        localField: 'visitId',
                        foreignField: '_id',
                        as: 'visit',
                    },
                },
                { $unwind: '$visit' },
                {
                    $group: {
                        _id: '$visit.visitType',
                        revenue: { $sum: '$finalAmount' },
                    },
                },
            ])
            .exec()

        const totalOverallRevenue = rawData.reduce(
            (sum, item) => sum + item.revenue,
            0
        )

        const categories = Object.values(VisitCategoryEnum)

        return categories.map((category) => {
            const matchedItem = rawData.find(
                (d) => (d._id as VisitCategoryEnum) === category
            )
            const revenue = matchedItem ? matchedItem.revenue : 0
            const percentage =
                totalOverallRevenue > 0
                    ? parseFloat(
                          ((revenue / totalOverallRevenue) * 100).toFixed(2)
                      )
                    : 0

            return {
                visitType: category,
                revenue,
                percentage,
            }
        })
    }

    // GET /finance/expenses-by-category
    async getExpensesByCategory(
        startDate: string,
        endDate: string
    ): Promise<GetExpensesByCategoryResponse[]> {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestException(
                'Invalid date format provided. Use YYYY-MM-DD.'
            )
        }

        const rawData = await this.expenseModel
            .aggregate<{ _id: string; expense: number }>([
                {
                    $match: {
                        expenseDate: { $gte: start, $lte: end },
                        status: FinancialStatusEnum.PAID,
                    },
                },
                {
                    $group: {
                        _id: '$expenseCategory',
                        expense: { $sum: '$expenseAmount' },
                    },
                },
            ])
            .exec()

        const totalOverallExpenses = rawData.reduce(
            (sum, item) => sum + item.expense,
            0
        )

        const categories = Object.values(ExpenseCategoryEnum)

        return categories.map((category) => {
            const matchedItem = rawData.find(
                (d) => (d._id as ExpenseCategoryEnum) === category
            )
            const expense = matchedItem ? matchedItem.expense : 0
            const percentage =
                totalOverallExpenses > 0
                    ? parseFloat(
                          ((expense / totalOverallExpenses) * 100).toFixed(2)
                      )
                    : 0

            return {
                expenseCategory: category,
                expense,
                percentage,
            }
        })
    }
}
