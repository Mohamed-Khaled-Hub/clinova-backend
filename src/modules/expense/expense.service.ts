// Core
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PopulateOptions, Types } from 'mongoose'
// DTOs
import { CreateExpenseDto } from '@/modules/expense/dto/create-expense.dto'
import { UpdateExpenseDto } from '@/modules/expense/dto/update-expense.dto'
// Enums
import { ExpenseCategoryEnum } from '@/common/enums/schemas.enum'
// Schemas
import {
    Expense,
    ExpenseDocument,
    PopulatedExpenseDocument,
} from '@/modules/expense/schemas/expense.schema'

@Injectable()
export class ExpenseService {
    constructor(
        @InjectModel(Expense.name)
        private readonly expenseModel: Model<ExpenseDocument>
    ) {}

    // Helpers
    private getStandardPopulate(): PopulateOptions {
        return {
            path: 'recordedByUserId',
            select: 'username fullNameEn fullNameAr',
        }
    }

    private mapToPopulatedExpense(
        expenseDoc: ExpenseDocument | null
    ): PopulatedExpenseDocument | null {
        if (!expenseDoc) return null

        const expenseObj = expenseDoc.toJSON()
        const { recordedByUserId, ...restOfExpense } = expenseObj

        return {
            ...restOfExpense,
            recordedBy: recordedByUserId,
        } as PopulatedExpenseDocument
    }

    // POST /expenses
    async create(
        createExpenseDto: CreateExpenseDto,
        userId: string
    ): Promise<PopulatedExpenseDocument> {
        const createdExpense = new this.expenseModel({
            ...createExpenseDto,
            recordedByUserId: new Types.ObjectId(userId),
        })
        const savedExpense = await createdExpense.save()
        const populated = await savedExpense.populate(
            this.getStandardPopulate()
        )
        return this.mapToPopulatedExpense(populated) as PopulatedExpenseDocument
    }

    // GET /expenses
    async findAll(): Promise<PopulatedExpenseDocument[]> {
        const expenses = await this.expenseModel
            .find()
            .populate(this.getStandardPopulate())
            .exec()
        return expenses
            .map((expense) => this.mapToPopulatedExpense(expense))
            .filter(
                (expense): expense is PopulatedExpenseDocument =>
                    expense !== null
            )
    }

    // GET /expenses/:id
    async findOne(id: string): Promise<PopulatedExpenseDocument | null> {
        const expense = await this.expenseModel
            .findById(id)
            .populate(this.getStandardPopulate())
            .exec()
        return this.mapToPopulatedExpense(expense)
    }

    // GET /expenses/category/:category
    async findByCategory(
        expenseCategory: ExpenseCategoryEnum
    ): Promise<PopulatedExpenseDocument[]> {
        const expenses = await this.expenseModel
            .find({ expenseCategory })
            .populate(this.getStandardPopulate())
            .exec()
        return expenses
            .map((expense) => this.mapToPopulatedExpense(expense))
            .filter(
                (expense): expense is PopulatedExpenseDocument =>
                    expense !== null
            )
    }

    // PATCH /expenses/:id
    async update(
        id: string,
        updateExpenseDto: UpdateExpenseDto,
        userId: string
    ): Promise<PopulatedExpenseDocument | null> {
        const updatePayload = {
            ...updateExpenseDto,
            recordedByUserId: new Types.ObjectId(userId),
        }

        const updatedExpense = await this.expenseModel
            .findByIdAndUpdate(id, updatePayload, {
                returnDocument: 'after',
            })
            .populate(this.getStandardPopulate())
            .exec()
        return this.mapToPopulatedExpense(updatedExpense)
    }

    // DELETE /expenses/:id
    async remove(id: string): Promise<ExpenseDocument | null> {
        return this.expenseModel.findByIdAndDelete(id).exec()
    }
}
