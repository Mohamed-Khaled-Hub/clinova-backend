// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { SettingsController } from '@/modules/settings/settings.controller'
// Modules
import { CloudinaryModule } from '@/modules/cloudinary/cloudinary.module'
// Schemas
import {
    Settings,
    SettingsSchema,
} from '@/modules/settings/schemas/settings.schema'
// Services
import { SettingsService } from '@/modules/settings/settings.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Settings.name, schema: SettingsSchema },
        ]),
        CloudinaryModule,
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
