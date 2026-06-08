// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { UserController } from '@/modules/user/user.controller'
// Schemas
import { User, UserSchema } from '@/modules/user/schemas/user.schema'
// Services
import { UserService } from '@/modules/user/user.service'
import { UserSeederService } from '@/modules/user/user-seeder.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService, UserSeederService],
    exports: [UserService],
})
export class UserModule {}
