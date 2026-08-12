// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { ExpenseController } from './expense.controller'
// Schemas
import { Expense, ExpenseSchema } from './schemas/expense.schema'
// Services
import { ExpenseService } from './expense.service'

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
