// Core
import {
    Get,
    Query,
    UseGuards,
    Controller,
    BadRequestException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// Enums
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
import { IntervalEnum } from '@/modules/finance/enums/finance.enum'
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Interfaces
import {
    GetExpensesByCategoryResponse,
    GetRevenueByCategoryResponse,
    GetSummaryResponse,
    GetTimelineResponse,
} from '@/modules/finance/interfaces/finance.responses.interface'
// Services
import { FinanceService } from '@/modules/finance/finance.service'

@Controller(EndpointsEnum.FINANCE)
@UseGuards(RoleGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) {}

    // GET /finance/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    @Get('summary')
    @RequirePermission(PermissionsEnum.FINANCE, 'canRead')
    async getSummary(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<GetSummaryResponse> {
        if (!startDate || !endDate) {
            throw new BadRequestException(
                'Both startDate and endDate queries are required'
            )
        }
        return this.financeService.getSummary(startDate, endDate)
    }

    // GET /finance/timeline?interval=monthly&year=2026
    @Get('timeline')
    @RequirePermission(PermissionsEnum.FINANCE, 'canRead')
    async getTimeline(
        @Query('interval') interval: IntervalEnum = IntervalEnum.MONTHLY,
        @Query('year') year: string
    ): Promise<GetTimelineResponse[]> {
        const targetYear = year ? parseInt(year, 10) : new Date().getFullYear()
        if (isNaN(targetYear)) {
            throw new BadRequestException(
                'Provided year query parameter must be a valid number'
            )
        }
        return this.financeService.getTimeline(interval, targetYear)
    }

    // GET /finance/revenue-by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    @Get('revenue-by-category')
    @RequirePermission(PermissionsEnum.FINANCE, 'canRead')
    async getRevenueByCategory(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<GetRevenueByCategoryResponse[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException(
                'Both startDate and endDate queries are required'
            )
        }
        return this.financeService.getRevenueByCategory(startDate, endDate)
    }

    // GET /finance/expenses-by-category?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
    @Get('expenses-by-category')
    @RequirePermission(PermissionsEnum.FINANCE, 'canRead')
    async getExpensesByCategory(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ): Promise<GetExpensesByCategoryResponse[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException(
                'Both startDate and endDate queries are required'
            )
        }
        return this.financeService.getExpensesByCategory(startDate, endDate)
    }
}
