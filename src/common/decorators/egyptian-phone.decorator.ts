// Core
import { applyDecorators } from '@nestjs/common'
import { IsString, Matches } from 'class-validator'
import type { ValidationOptions } from 'class-validator'

export function IsEgyptianPhone(
    fieldName = 'Phone number',
    validationOptions?: ValidationOptions
) {
    return applyDecorators(
        IsString(validationOptions),
        Matches(
            /^(?:(?:\+20|0)?1[0125]\d{8}|(?:\+20|0)(?:2\d{8}|3\d{7}|554\d{6}|(?:13|15|40|45|46|47|48|50|55|56|57|62|64|65|66|68|69|82|84|86|88|92|93|95|96|97)\d{7}))$/,
            {
                ...validationOptions,
                message: `${fieldName} must be a valid Egyptian mobile or landline number.`,
            }
        )
    )
}
