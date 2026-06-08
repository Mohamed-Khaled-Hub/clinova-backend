// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { SettingsController } from '@/modules/settings/settings.controller'
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
    ],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}
