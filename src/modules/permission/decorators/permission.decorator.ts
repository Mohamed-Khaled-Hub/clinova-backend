// Core
import { CustomDecorator, SetMetadata } from '@nestjs/common'
// Interfaces
import { RequiredPermission } from '@/modules/permission/interfaces/required-permission.interface'

// Key
export const PERMISSION_KEY = 'requiredPermission'

// Decorator
export const RequirePermission = (
    permission: string,
    action: RequiredPermission['action']
): CustomDecorator => SetMetadata(PERMISSION_KEY, { permission, action })
