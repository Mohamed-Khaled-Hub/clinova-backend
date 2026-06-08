// Core
import {
    Get,
    Req,
    Body,
    Post,
    Patch,
    Param,
    Delete,
    UseGuards,
    Controller,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { CreateExpenseDto } from '@/modules/expense/dto/create-expense.dto'
import { UpdateExpenseDto } from '@/modules/expense/dto/update-expense.dto'
// Enums
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
import { ExpenseCategoryEnum } from '@/common/enums/schemas.enum'
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import { MessageResponse } from '@/common/interfaces/response.interface'
import type { AuthenticatedRequest } from '@/modules/auth/interfaces/auth.interface'
// Schemas
import { PopulatedExpenseDocument } from '@/modules/expense/schemas/expense.schema'
// Services
import { ExpenseService } from '@/modules/expense/expense.service'

@Controller(EndpointsEnum.EXPENSE)
@UseGuards(RoleGuard)
export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) {}

    // POST /expenses
    @Post()
    @RequirePermission(PermissionsEnum.EXPENSE, 'canWrite')
    async create(
        @Body() createExpenseDto: CreateExpenseDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedExpenseDocument> {
        return this.expenseService.create(createExpenseDto, req.user.sub)
    }

    // GET /expenses
    @Get()
    @RequirePermission(PermissionsEnum.EXPENSE, 'canRead')
    async findAll(): Promise<PopulatedExpenseDocument[]> {
        return this.expenseService.findAll()
    }

    // GET /expenses/:id
    @Get(':id')
    @RequirePermission(PermissionsEnum.EXPENSE, 'canRead')
    async findOne(@Param('id') id: string): Promise<PopulatedExpenseDocument> {
        const record = await this.expenseService.findOne(id)
        if (!record) throw new NotFoundException('Expense record not found')
        return record
    }

    // GET /expenses/category/:category
    @Get('category/:category')
    @RequirePermission(PermissionsEnum.EXPENSE, 'canRead')
    async findByCategory(
        @Param('category') category: ExpenseCategoryEnum
    ): Promise<PopulatedExpenseDocument[]> {
        return this.expenseService.findByCategory(category)
    }

    // PATCH /expenses/:id
    @Patch(':id')
    @RequirePermission(PermissionsEnum.EXPENSE, 'canWrite')
    async update(
        @Param('id') id: string,
        @Body() updateExpenseDto: UpdateExpenseDto,
        @Req() req: AuthenticatedRequest
    ): Promise<PopulatedExpenseDocument> {
        const updatedRecord = await this.expenseService.update(
            id,
            updateExpenseDto,
            req.user.sub
        )
        if (!updatedRecord)
            throw new NotFoundException('Expense record not found')
        return updatedRecord
    }

    // DELETE /expenses/:id
    @Delete(':id')
    @RequirePermission(PermissionsEnum.EXPENSE, 'canWrite')
    async remove(@Param('id') id: string): Promise<MessageResponse> {
        const deletedRecord = await this.expenseService.remove(id)
        if (!deletedRecord)
            throw new NotFoundException('Expense record not found')
        return { message: 'Expense record deleted successfully' }
    }
}
