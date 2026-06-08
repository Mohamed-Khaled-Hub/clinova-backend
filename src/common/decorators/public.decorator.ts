// Core
import { SetMetadata, CustomDecorator } from '@nestjs/common'

// Key
export const IS_PUBLIC_KEY = 'isPublic'

// Decorator
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true)
