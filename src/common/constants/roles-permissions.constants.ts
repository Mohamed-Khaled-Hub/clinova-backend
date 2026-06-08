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
            fullAccess(PermissionsEnum.PATIENT),
            fullAccess(PermissionsEnum.VISIT),
            readOnlyAccess(PermissionsEnum.EXPENSE),
            readOnlyAccess(PermissionsEnum.REVENUE),
            fullAccess(PermissionsEnum.SETTINGS),
            fullAccess(PermissionsEnum.PRICE_CATALOG),
        ],
    },
    [RolesEnum.RECEPTIONIST]: {
        roleName: RolesEnum.RECEPTIONIST,
        permissions: [
            readOnlyAccess(PermissionsEnum.PATIENT),
            readOnlyAccess(PermissionsEnum.VISIT),
            fullAccess(PermissionsEnum.REVENUE),
            fullAccess(PermissionsEnum.EXPENSE),
            readOnlyAccess(PermissionsEnum.SETTINGS),
            readOnlyAccess(PermissionsEnum.PRICE_CATALOG),
        ],
    },
}
