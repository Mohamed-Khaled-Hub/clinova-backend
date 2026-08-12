// Core
import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { RoleController } from './role.controller'
// Modules
import { PermissionModule } from '../permission/permission.module'
// Schemas
import { Role, RoleSchema } from './schemas/role.schema'
import {
    Permission,
    PermissionSchema,
} from '../permission/schemas/permission.schema'
// Services
import { RoleService } from './role.service'
import { RoleSeederService } from './role-seeder.service'

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
