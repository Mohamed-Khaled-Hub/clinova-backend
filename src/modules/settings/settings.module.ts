// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { SettingsController } from 'src/modules/settings/settings.controller'
// Modules
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module'
// Schemas
import {
    Settings,
    SettingsSchema,
} from 'src/modules/settings/schemas/settings.schema'
// Services
import { SettingsService } from 'src/modules/settings/settings.service'

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
