// Core
import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    NotFoundException,
    FileTypeValidator,
    MaxFileSizeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
// Decorators
import { RequirePermission } from '../permission/decorators/permission.decorator'
// DTOs
import { UpdateSettingsDto } from './dto/update-settings.dto'
// Enums
import { PermissionsEnum } from '../../common/enums/roles-permissions.enum'
import { EndpointsEnum } from '../../common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '../role/guards/role.guard'
// Schemas
import { SettingsDocument } from './schemas/settings.schema'
// Services
import { SettingsService } from './settings.service'

@Controller(EndpointsEnum.SETTINGS)
@UseGuards(RoleGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    // GET /settings
    @Get()
    @RequirePermission(PermissionsEnum.SETTINGS, 'canRead')
    async getSettings(): Promise<SettingsDocument> {
        const settings = await this.settingsService.getSettings()
        if (!settings) throw new NotFoundException('Settings not found')
        return settings
    }

    // PATCH /settings
    @Patch()
    @RequirePermission(PermissionsEnum.SETTINGS, 'canWrite')
    async updateSettings(
        @Body() updateSettingsDto: UpdateSettingsDto
    ): Promise<SettingsDocument> {
        const updatedSettings =
            await this.settingsService.updateSettings(updateSettingsDto)
        if (!updatedSettings) throw new NotFoundException('Settings not found')
        return updatedSettings
    }

    // PATCH /settings/logo
    @Patch('logo')
    @RequirePermission(PermissionsEnum.SETTINGS, 'canWrite')
    @UseInterceptors(FileInterceptor('file'))
    async updateLogo(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp|svg)',
                    }),
                ],
                fileIsRequired: true,
            })
        )
        file: Express.Multer.File
    ): Promise<SettingsDocument> {
        const updatedSettings = await this.settingsService.updateLogo(file)
        if (!updatedSettings) throw new NotFoundException('Settings not found')
        return updatedSettings
    }

    // PATCH /settings/secondary-logo
    @Patch('secondary-logo')
    @RequirePermission(PermissionsEnum.SETTINGS, 'canWrite')
    @UseInterceptors(FileInterceptor('file'))
    async updateSecondaryLogo(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp|svg)',
                    }),
                ],
                fileIsRequired: true,
            })
        )
        file: Express.Multer.File
    ): Promise<SettingsDocument> {
        const updatedSettings =
            await this.settingsService.updateSecondaryLogo(file)
        if (!updatedSettings) throw new NotFoundException('Settings not found')
        return updatedSettings
    }

    // PATCH /settings/watermark
    @Patch('watermark')
    @RequirePermission(PermissionsEnum.SETTINGS, 'canWrite')
    @UseInterceptors(FileInterceptor('file'))
    async updateWatermark(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
                    new FileTypeValidator({
                        fileType: '.(png|jpeg|jpg|webp|svg)',
                    }),
                ],
                fileIsRequired: true,
            })
        )
        file: Express.Multer.File
    ): Promise<SettingsDocument> {
        const updatedSettings = await this.settingsService.updateWatermark(file)
        if (!updatedSettings) throw new NotFoundException('Settings not found')
        return updatedSettings
    }
}
