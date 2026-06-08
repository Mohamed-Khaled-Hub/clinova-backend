// Core
import { Controller, Post, Body, Req } from '@nestjs/common'
// Decorators
import { Public } from '@/common/decorators/public.decorator'
// DTOs
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { RefreshTokenDto } from '@/modules/auth/dto/refresh.dto'
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto'
// Enums
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Interfaces
import type {
    TokenResponse,
    AuthenticatedRequest,
} from '@/modules/auth/interfaces/auth.interface'
import { MessageResponse } from '@/common/interfaces/response.interface'
// Services
import { AuthService } from '@/modules/auth/auth.service'

@Controller(EndpointsEnum.AUTH)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST /auth/login
    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
        return this.authService.login(loginDto)
    }

    // POST /auth/refresh
    @Public()
    @Post('refresh')
    async refresh(@Body() refreshDto: RefreshTokenDto): Promise<TokenResponse> {
        return this.authService.refresh(refreshDto)
    }

    // POST /auth/change-password
    @Post('change-password')
    async changePassword(
        @Req() req: AuthenticatedRequest,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<MessageResponse> {
        const userId = req.user.sub
        return this.authService.changePassword(userId, changePasswordDto)
    }
}
