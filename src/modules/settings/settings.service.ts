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
// Services
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service'
// Variables
import { SETTINGS_ID } from '@/modules/settings/schemas/settings.schema'

@Injectable()
export class SettingsService {
    private readonly SETTINGS_ID = SETTINGS_ID

    constructor(
        @InjectModel(Settings.name)
        private readonly settingsModel: Model<SettingsDocument>,
        private readonly cloudinaryService: CloudinaryService
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

    // PATCH /settings/logo
    async updateLogo(
        file: Express.Multer.File
    ): Promise<SettingsDocument | null> {
        const currentSettings = await this.getSettings()

        if (currentSettings?.logoUrl) {
            try {
                const urlParts = currentSettings.logoUrl.split('/')
                const fileNameWithExtension = urlParts[urlParts.length - 1]
                const [publicId] = fileNameWithExtension.split('.')

                await this.cloudinaryService.deleteImage(
                    `clinic_logos/${publicId}`
                )
            } catch (error) {
                console.error(
                    'Failed to delete old logo from Cloudinary:',
                    error
                )
            }
        }

        const uploadResult = await this.cloudinaryService.uploadImage(
            file,
            'clinic_logos'
        )

        return this.settingsModel
            .findByIdAndUpdate(
                this.SETTINGS_ID,
                { logoUrl: uploadResult.secure_url },
                { returnDocument: 'after', upsert: true }
            )
            .exec()
    }
}
