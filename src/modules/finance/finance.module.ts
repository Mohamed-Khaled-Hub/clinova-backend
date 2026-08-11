// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { FinanceController } from 'src/modules/finance/finance.controller'
// Services
import { FinanceService } from 'src/modules/finance/finance.service'
// Schemas
import {
    Revenue,
    RevenueSchema,
} from 'src/modules/revenue/schemas/revenue.schema'
import {
    Expense,
    ExpenseSchema,
} from 'src/modules/expense/schemas/expense.schema'

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
