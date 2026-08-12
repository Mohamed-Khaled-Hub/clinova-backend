// Core
import { PartialType } from '@nestjs/swagger'
// DTOs
import { CreateSettingsDto } from './create-settings.dto'

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {}
