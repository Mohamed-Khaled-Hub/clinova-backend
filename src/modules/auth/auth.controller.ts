// Core
import { Controller, Post, Body, Req } from '@nestjs/common'
// Decorators
import { Public } from 'src/common/decorators/public.decorator'
// DTOs
import { LoginDto } from 'src/modules/auth/dto/login.dto'
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh.dto'
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto'
// Enums
import { EndpointsEnum } from 'src/common/enums/endpoints.enum'
// Interfaces
import type {
    TokenResponse,
    AuthenticatedRequest,
} from 'src/modules/auth/interfaces/auth.interface'
import { MessageResponse } from 'src/common/interfaces/response.interface'
// Services
import { AuthService } from 'src/modules/auth/auth.service'

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
