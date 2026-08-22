// Core
import { applyDecorators } from '@nestjs/common'
import { IsString, Matches } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsArabic(
    fieldName = 'Field',
    validationOptions?: ValidationOptions
) {
    return applyDecorators(
        IsString(validationOptions),
        Matches(/^(?![a-zA-Z])[\p{Script=Arabic}\p{P}\p{S}\p{N}\s]+$/u, {
            ...validationOptions,
            message: `${fieldName} must contain only Arabic characters, numerals, and spaces.`,
        })
    )
}
