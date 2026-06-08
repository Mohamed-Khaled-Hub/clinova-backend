// Core
import 'dotenv/config'

export const jwtConstants = {
    secret: process.env.JWT_ACCESS_SECRET ?? 'super-secret-access-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'super-secret-refresh-key',
    accessTokenExpires: '7d', // TODO: Remember to change it from 7d to 15m
    refreshTokenExpires: '7d',
} as const
