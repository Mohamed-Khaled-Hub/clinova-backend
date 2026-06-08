// Core
import { applyDecorators } from '@nestjs/common'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export function IsStrongPassword(fieldName = 'Password') {
    return applyDecorators(
        IsNotEmpty(),
        IsString(),
        MinLength(8, {
            message: `${fieldName} must be at least 8 characters long`,
        }),
        Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: `${fieldName} is too weak. It must contain at least one uppercase letter, one lowercase letter, and one number or special character.`,
        })
    )
}
