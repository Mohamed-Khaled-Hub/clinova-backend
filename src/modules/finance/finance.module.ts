// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { FinanceController } from './finance.controller'
// Services
import { FinanceService } from './finance.service'
// Schemas
import { Revenue, RevenueSchema } from '../revenue/schemas/revenue.schema'
import { Expense, ExpenseSchema } from '../expense/schemas/expense.schema'

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
