// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { PermissionController } from './permission.controller'
// Schemas
import { Permission, PermissionSchema } from './schemas/permission.schema'
// Services
import { PermissionService } from './permission.service'

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
