// Core
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
// Interfaces
import { JwtPayload } from '@/modules/auth/interfaces/auth.interface'
// Variables
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { jwtConstants } from '@/common/constants/auth.constants'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        )
        if (isPublic) return true

        const request = context.switchToHttp().getRequest<Request>()
        const token = this.extractTokenFromHeader(request)
        if (!token) throw new UnauthorizedException('Token missing')

        try {
            request['user'] = await this.jwtService.verifyAsync<JwtPayload>(
                token,
                {
                    secret: jwtConstants.secret,
                }
            )
        } catch {
            throw new UnauthorizedException('Invalid or expired token')
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
