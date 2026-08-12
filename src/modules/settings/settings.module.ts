// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { SettingsController } from './settings.controller'
// Modules
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
// Schemas
import { Settings, SettingsSchema } from './schemas/settings.schema'
// Services
import { SettingsService } from './settings.service'

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
