// Core
import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { Response, NextFunction } from 'express'
// Interfaces
import { AuthenticatedRequest } from '@/modules/auth/interfaces/auth.interface'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP')

    use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
        const { method, originalUrl, ip } = req
        const userAgent = req.get('user-agent') || ''
        const startTime = Date.now()

        res.on('finish', () => {
            const { statusCode } = res
            const duration = Date.now() - startTime

            // Core ANSI escape controllers
            const RESET = '\x1b[0m'
            const YELLOW = '\x1b[33m' // Request warnings
            const RED = '\x1b[31m' // 5xx Server errors
            const GREEN = '\x1b[32m' // 2xx Success statuses

            // Postman-Specific Extended 8-bit ANSI Color Hues
            const POSTMAN_GET = '\x1b[38;5;48m' // Mint Green
            const POSTMAN_POST = '\x1b[38;5;208m' // Deep Orange
            const POSTMAN_PUT = '\x1b[38;5;75m' // Ocean Blue
            const POSTMAN_PATCH = '\x1b[38;5;178m' // Warm Amber
            const POSTMAN_DELETE = '\x1b[38;5;168m' // Light Coral

            let methodColor: string
            switch (method.toUpperCase()) {
                case 'GET':
                    methodColor = POSTMAN_GET
                    break
                case 'POST':
                    methodColor = POSTMAN_POST
                    break
                case 'PUT':
                    methodColor = POSTMAN_PUT
                    break
                case 'PATCH':
                    methodColor = POSTMAN_PATCH
                    break
                case 'DELETE':
                    methodColor = POSTMAN_DELETE
                    break
                default:
                    methodColor = '\x1b[35m'
            }
            const formattedMethod = `${methodColor}${method}${RESET}`

            let formattedStatus = `${statusCode}`
            if (statusCode >= 500) {
                formattedStatus = `${RED}${statusCode}${RESET}`
            } else if (statusCode >= 400) {
                formattedStatus = `${YELLOW}${statusCode}${RESET}`
            } else if (statusCode >= 200) {
                formattedStatus = `${GREEN}${statusCode}${RESET}`
            }

            const formattedDuration =
                duration > 400
                    ? `${YELLOW}${duration}ms${RESET}`
                    : `${duration}ms`

            const userId = req.user?.sub
                ? `[User: ${req.user.sub}]`
                : '[Unauthenticated]'

            const logMessage = `${formattedMethod} ${originalUrl}${RESET} ${formattedStatus} - ${formattedDuration} - IP: ${ip} ${userId} ${userAgent}`

            if (statusCode >= 500) {
                this.logger.error(logMessage)
            } else if (statusCode >= 400) {
                this.logger.warn(logMessage)
            } else {
                this.logger.log(logMessage)
            }
        })

        next()
    }
}
