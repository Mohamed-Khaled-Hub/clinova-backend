// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PermissionController } from 'src/modules/permission/permission.controller'
// Schemas
import {
    Permission,
    PermissionSchema,
} from 'src/modules/permission/schemas/permission.schema'
// Services
import { PermissionService } from 'src/modules/permission/permission.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Permission.name, schema: PermissionSchema },
        ]),
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
