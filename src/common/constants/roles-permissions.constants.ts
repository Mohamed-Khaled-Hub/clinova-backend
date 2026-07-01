// Enums
import {
    PermissionsEnum,
    RolesEnum,
} from '@/common/enums/roles-permissions.enum'
// Types
import {
    MatrixPermissionType,
    MatrixRoleType,
} from '@/common/types/roles-permissions.type'

// Helpers
const fullAccess = (permissionKey: PermissionsEnum): MatrixPermissionType => ({
    permissionKey,
    canRead: true,
    canWrite: true,
})

const readOnlyAccess = (
    permissionKey: PermissionsEnum
): MatrixPermissionType => ({
    permissionKey,
    canRead: true,
    canWrite: false,
})

const noAccess = (permissionKey: PermissionsEnum): MatrixPermissionType => ({
    permissionKey,
    canRead: false,
    canWrite: false,
})

// Matrix
export const ROLES_PERMISSIONS_MATRIX: Record<RolesEnum, MatrixRoleType> = {
    [RolesEnum.SUPER_ADMIN]: {
        roleName: RolesEnum.SUPER_ADMIN,
        permissions: Object.values(PermissionsEnum).map((permissionKey) =>
            fullAccess(permissionKey)
        ),
    },
    [RolesEnum.ADMIN]: {
        roleName: RolesEnum.ADMIN,
        permissions: Object.values(PermissionsEnum).map((permissionKey) =>
            fullAccess(permissionKey)
        ),
    },
    [RolesEnum.DOCTOR]: {
        roleName: RolesEnum.DOCTOR,
        permissions: [
            noAccess(PermissionsEnum.USER),
            noAccess(PermissionsEnum.ROLE),
            noAccess(PermissionsEnum.PERMISSION),
            fullAccess(PermissionsEnum.PRICE_CATALOG),
            readOnlyAccess(PermissionsEnum.REVENUE),
            readOnlyAccess(PermissionsEnum.EXPENSE),
            fullAccess(PermissionsEnum.PATIENT),
            fullAccess(PermissionsEnum.VISIT),
            fullAccess(PermissionsEnum.SETTINGS),
            readOnlyAccess(PermissionsEnum.FINANCE),
        ],
    },
    [RolesEnum.RECEPTIONIST]: {
        roleName: RolesEnum.RECEPTIONIST,
        permissions: [
            noAccess(PermissionsEnum.USER),
            noAccess(PermissionsEnum.ROLE),
            noAccess(PermissionsEnum.PERMISSION),
            readOnlyAccess(PermissionsEnum.PRICE_CATALOG),
            fullAccess(PermissionsEnum.REVENUE),
            fullAccess(PermissionsEnum.EXPENSE),
            readOnlyAccess(PermissionsEnum.PATIENT),
            readOnlyAccess(PermissionsEnum.VISIT),
            readOnlyAccess(PermissionsEnum.SETTINGS),
            readOnlyAccess(PermissionsEnum.FINANCE),
        ],
    },
}
