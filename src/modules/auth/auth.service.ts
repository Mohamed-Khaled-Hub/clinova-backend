// Core
import * as bcrypt from 'bcrypt'
import {
    Injectable,
    ForbiddenException,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// DTOs
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { RefreshTokenDto } from '@/modules/auth/dto/refresh.dto'
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto'
// Interfaces
import { TokenResponse } from '@/modules/auth/interfaces/auth.interface'
import { MessageResponse } from '@/common/interfaces/response.interface'
// Services
import { UserService } from '@/modules/user/user.service'
// Variables
import { jwtConstants } from '@/common/constants/auth.constants'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    // Helpers
    async generateTokens(
        userId: string,
        username: string,
        roleId: string,
        existingRefreshToken?: string
    ): Promise<TokenResponse> {
        const payload = { sub: userId, username, roleId }

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.accessTokenExpires,
        })

        if (existingRefreshToken) {
            try {
                const decoded = await this.jwtService.verifyAsync<{
                    exp: number
                }>(existingRefreshToken, { secret: jwtConstants.refreshSecret })

                const currentTimestamp = Math.floor(Date.now() / 1000)

                // 1 day (86400s)
                if (decoded.exp - currentTimestamp > 86400) {
                    return { accessToken, refreshToken: existingRefreshToken }
                }
            } catch {
                throw new ForbiddenException('Invalid Refresh Token')
            }
        }

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: jwtConstants.refreshSecret,
            expiresIn: jwtConstants.refreshTokenExpires,
        })

        return { accessToken, refreshToken }
    }

    private async hashAndSaveRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        const salt = await bcrypt.genSalt()
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt)

        await this.userService.updateRefreshToken(userId, hashedRefreshToken)
    }

    // POST /auth/login
    async login(loginDto: LoginDto): Promise<TokenResponse> {
        const userWithSecrets = await this.userService.findByUsername(
            loginDto.username,
            true
        )
        if (!userWithSecrets)
            throw new UnauthorizedException('Invalid username')

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            userWithSecrets.passwordHash
        )
        if (!isPasswordValid)
            throw new UnauthorizedException('Invalid password')

        const userId = userWithSecrets._id.toString()
        const roleId = userWithSecrets.role._id.toString()

        const tokens = await this.generateTokens(
            userId,
            userWithSecrets.username,
            roleId
        )
        await this.hashAndSaveRefreshToken(userId, tokens.refreshToken)

        return tokens
    }

    // POST /auth/refresh
    async refresh(refreshDto: RefreshTokenDto): Promise<TokenResponse> {
        const userWithToken = await this.userService.findOne(
            refreshDto.userId,
            true
        )

        if (!userWithToken || !userWithToken.hashedRefreshToken)
            throw new ForbiddenException('Access Denied')

        try {
            await this.jwtService.verifyAsync(refreshDto.refreshToken, {
                secret: jwtConstants.refreshSecret,
            })
        } catch {
            throw new ForbiddenException('Invalid Refresh Token')
        }

        const tokenMatches = await bcrypt.compare(
            refreshDto.refreshToken,
            userWithToken.hashedRefreshToken
        )

        if (!tokenMatches) throw new ForbiddenException('Access Denied')

        const userId = userWithToken._id.toString()
        const roleId = userWithToken.role._id.toString()

        const tokens = await this.generateTokens(
            userId,
            userWithToken.username,
            roleId,
            refreshDto.refreshToken
        )

        if (tokens.refreshToken !== refreshDto.refreshToken) {
            await this.hashAndSaveRefreshToken(userId, tokens.refreshToken)
        }

        return tokens
    }

    // POST /auth/change-password
    async changePassword(
        userId: string,
        changePasswordDto: ChangePasswordDto
    ): Promise<MessageResponse> {
        const userWithSecrets = await this.userService.findOne(userId, true)
        if (!userWithSecrets)
            throw new UnauthorizedException('User profile not found')

        const isOldPasswordValid = await bcrypt.compare(
            changePasswordDto.oldPassword,
            userWithSecrets.passwordHash
        )
        if (!isOldPasswordValid)
            throw new UnauthorizedException('Invalid current password')

        const isSamePassword = await bcrypt.compare(
            changePasswordDto.newPassword,
            userWithSecrets.passwordHash
        )
        if (isSamePassword) {
            throw new BadRequestException(
                'New password cannot be the same as your current password'
            )
        }

        const salt = await bcrypt.genSalt()
        const newPasswordHash = await bcrypt.hash(
            changePasswordDto.newPassword,
            salt
        )

        await this.userService.updatePassword(userId, newPasswordHash)

        return { message: 'Password updated successfully' }
    }
}
