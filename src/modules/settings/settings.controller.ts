// Core
import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    NotFoundException,
} from '@nestjs/common'
// Decorators
import { RequirePermission } from '@/modules/permission/decorators/permission.decorator'
// DTOs
import { UpdateSettingsDto } from '@/modules/settings/dto/update-settings.dto'
// Enums
import { PermissionsEnum } from '@/common/enums/roles-permissions.enum'
import { EndpointsEnum } from '@/common/enums/endpoints.enum'
// Guards
import { RoleGuard } from '@/modules/role/guards/role.guard'
// Schemas
import { SettingsDocument } from '@/modules/settings/schemas/settings.schema'
// Services
import { SettingsService } from '@/modules/settings/settings.service'

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
}
