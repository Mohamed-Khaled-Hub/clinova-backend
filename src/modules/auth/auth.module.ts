// Core
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
// Controllers
import { AuthController } from './auth.controller'
// Modules
import { UserModule } from '../user/user.module'
// Services
import { AuthService } from './auth.service'

@Module({
    imports: [UserModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
