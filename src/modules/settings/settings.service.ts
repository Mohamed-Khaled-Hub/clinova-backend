// Core
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// DTOs
import { UpdateSettingsDto } from '@/modules/settings/dto/update-settings.dto'
// Schemas
import {
    Settings,
    SettingsDocument,
} from '@/modules/settings/schemas/settings.schema'
// Variables
import { SETTINGS_ID } from '@/modules/settings/schemas/settings.schema'

@Injectable()
export class SettingsService {
    private readonly SETTINGS_ID = SETTINGS_ID

    constructor(
        @InjectModel(Settings.name)
        private readonly settingsModel: Model<SettingsDocument>
    ) {}

    // GET /settings
    async getSettings(): Promise<SettingsDocument> {
        let settings = await this.settingsModel
            .findById(this.SETTINGS_ID)
            .exec()
        if (!settings) {
            settings = new this.settingsModel({ _id: this.SETTINGS_ID })
            await settings.save()
        }
        return settings
    }

    // PATCH /settings
    async updateSettings(
        updateSettingsDto: UpdateSettingsDto
    ): Promise<SettingsDocument | null> {
        return this.settingsModel
            .findByIdAndUpdate(this.SETTINGS_ID, updateSettingsDto, {
                returnDocument: 'after',
                upsert: true,
            })
            .exec()
    }
}
