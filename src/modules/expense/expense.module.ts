// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { ExpenseController } from '@/modules/expense/expense.controller'
// Schemas
import {
    Expense,
    ExpenseSchema,
} from '@/modules/expense/schemas/expense.schema'
// Services
import { ExpenseService } from '@/modules/expense/expense.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Expense.name, schema: ExpenseSchema },
        ]),
    ],
    controllers: [ExpenseController],
    providers: [ExpenseService],
    exports: [ExpenseService],
})
export class ExpenseModule {}
