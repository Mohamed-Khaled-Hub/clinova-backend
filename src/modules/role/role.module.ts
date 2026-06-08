// Core
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RoleController } from '@/modules/role/role.controller'
// Modules
import { PermissionModule } from '@/modules/permission/permission.module'
// Schemas
import { Role, RoleSchema } from '@/modules/role/schemas/role.schema'
import {
    Permission,
    PermissionSchema,
} from '@/modules/permission/schemas/permission.schema'
// Services
import { RoleService } from '@/modules/role/role.service'
import { RoleSeederService } from '@/modules/role/role-seeder.service'

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: Permission.name, schema: PermissionSchema },
        ]),
        PermissionModule,
    ],
    controllers: [RoleController],
    providers: [RoleService, RoleSeederService],
    exports: [RoleService],
})
export class RoleModule {}
