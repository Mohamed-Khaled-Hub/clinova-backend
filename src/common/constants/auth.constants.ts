// Core
import 'dotenv/config'

export const jwtConstants = {
    secret: process.env.JWT_ACCESS_SECRET ?? 'super-secret-access-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'super-secret-refresh-key',
    accessTokenExpires: '15m',
    refreshTokenExpires: '7d',
} as const
