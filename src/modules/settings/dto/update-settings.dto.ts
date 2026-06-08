// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreateSettingsDto } from '@/modules/settings/dto/create-settings.dto'

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
