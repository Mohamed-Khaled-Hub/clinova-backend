// Enums
import {
    RolesEnum,
    PermissionsEnum,
} from 'src/common/enums/roles-permissions.enum'
// Schemas
import { Role, RolePermission } from 'src/modules/role/schemas/role.schema'

export type MatrixPermissionType = Omit<RolePermission, 'permissionId'> & {
    permissionKey: PermissionsEnum
}

export type MatrixRoleType = Omit<Role, 'permissions' | 'roleName'> & {
    roleName: RolesEnum
    permissions: MatrixPermissionType[]
}
