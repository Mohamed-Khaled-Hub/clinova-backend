// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreateExpenseDto } from '@/modules/expense/dto/create-expense.dto'

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
