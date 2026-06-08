// Core
import { Request } from 'express'

export interface JwtPayload {
    sub: string
    username: string
    roleId: string
}

export interface AuthenticatedRequest extends Request {
    user: JwtPayload
}

export interface TokenResponse {
    accessToken: string
    refreshToken: string
}
