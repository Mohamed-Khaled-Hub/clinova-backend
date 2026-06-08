// Core
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
// Controllers
import { AuthController } from '@/modules/auth/auth.controller'
// Modules
import { UserModule } from '@/modules/user/user.module'
// Services
import { AuthService } from '@/modules/auth/auth.service'

@Module({
    imports: [UserModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
