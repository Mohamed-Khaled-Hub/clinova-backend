// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreateSettingsDto } from 'src/modules/settings/dto/create-settings.dto'

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
