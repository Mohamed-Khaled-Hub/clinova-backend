// Core
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RoleController } from 'src/modules/role/role.controller'
// Modules
import { PermissionModule } from 'src/modules/permission/permission.module'
// Schemas
import { Role, RoleSchema } from 'src/modules/role/schemas/role.schema'
import {
    Permission,
    PermissionSchema,
} from 'src/modules/permission/schemas/permission.schema'
// Services
import { RoleService } from 'src/modules/role/role.service'
import { RoleSeederService } from 'src/modules/role/role-seeder.service'

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
