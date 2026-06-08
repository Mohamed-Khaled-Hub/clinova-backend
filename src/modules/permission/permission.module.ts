// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PermissionController } from '@/modules/permission/permission.controller'
// Schemas
import {
    Permission,
    PermissionSchema,
} from '@/modules/permission/schemas/permission.schema'
// Services
import { PermissionService } from '@/modules/permission/permission.service'

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
