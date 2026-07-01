// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { FinanceController } from '@/modules/finance/finance.controller'
// Services
import { FinanceService } from '@/modules/finance/finance.service'
// Schemas
import {
    Revenue,
    RevenueSchema,
} from '@/modules/revenue/schemas/revenue.schema'
import {
    Expense,
    ExpenseSchema,
} from '@/modules/expense/schemas/expense.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Revenue.name, schema: RevenueSchema },
            { name: Expense.name, schema: ExpenseSchema },
        ]),
    ],
    controllers: [FinanceController],
    providers: [FinanceService],
})
export class FinanceModule {}
