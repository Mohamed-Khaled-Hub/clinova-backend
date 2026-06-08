// Core
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
// Interfaces
import type { JwtPayload } from '@/modules/auth/interfaces/auth.interface'
import { RequiredPermission } from '@/modules/permission/interfaces/required-permission.interface'
// Services
import { RoleService } from '@/modules/role/role.service'
// Variables
import { PERMISSION_KEY } from '@/modules/permission/decorators/permission.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly roleService: RoleService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission =
            this.reflector.getAllAndOverride<RequiredPermission>(
                PERMISSION_KEY,
                [context.getHandler(), context.getClass()]
            )

        if (!requiredPermission) return true

        const request = context
            .switchToHttp()
            .getRequest<{ user?: JwtPayload }>()
        const userPayload = request.user

        if (!userPayload?.roleId) {
            throw new ForbiddenException(
                'Access denied. Security role metadata missing.'
            )
        }

        const roleDoc = await this.roleService.findOne(userPayload.roleId)

        if (!roleDoc || !roleDoc.permissions) {
            throw new ForbiddenException(
                'Access denied. Role configuration not found.'
            )
        }

        const targetPermission = requiredPermission.permission

        const matchedAssignment = roleDoc.permissions.find((p) => {
            const permissionInfo = p.permission

            if (!permissionInfo || !permissionInfo.permissionKey) {
                return false
            }

            return permissionInfo.permissionKey === targetPermission
        })

        if (!matchedAssignment) {
            throw new ForbiddenException(
                `Access denied for resource: ${requiredPermission.permission}`
            )
        }

        const hasPermission = matchedAssignment[requiredPermission.action]

        if (!hasPermission) {
            throw new ForbiddenException(
                `Insufficient permissions to ${requiredPermission.action} on ${requiredPermission.permission}`
            )
        }

        return true
    }
}
