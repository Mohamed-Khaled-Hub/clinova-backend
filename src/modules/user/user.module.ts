// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { UserController } from './user.controller'
// Modules
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
// Schemas
import { User, UserSchema } from './schemas/user.schema'
// Services
import { UserService } from './user.service'
import { UserSeederService } from './user-seeder.service'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        CloudinaryModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserSeederService],
    exports: [UserService],
})
export class UserModule {}
