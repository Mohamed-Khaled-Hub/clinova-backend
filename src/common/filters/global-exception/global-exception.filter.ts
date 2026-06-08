// Core
import {
    Catch,
    HttpStatus,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
} from '@nestjs/common'
import { Response, Request } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message: string | string[] = 'Internal server error'

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            const resBody = exception.getResponse()
            message =
                typeof resBody === 'object' && 'message' in resBody
                    ? (resBody as { message: string | string[] }).message
                    : exception.message
        } else if (exception && typeof exception === 'object') {
            const err = exception as Record<string, unknown>

            if (err.code === 11000) {
                status = HttpStatus.CONFLICT
                const duplicateField = err.keyValue
                    ? Object.keys(err.keyValue)[0]
                    : 'field'
                message = `The ${duplicateField} already exists.`
            } else if (err.name === 'ValidationError' && 'errors' in err) {
                status = HttpStatus.BAD_REQUEST
                const validationErrors = err.errors as Record<
                    string,
                    { message: string }
                >
                message = Object.values(validationErrors).map((e) => e.message)
            }
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        })
    }
}
