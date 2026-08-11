// Core
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// Controllers
import { UserController } from 'src/modules/user/user.controller'
// Modules
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module'
// Schemas
import { User, UserSchema } from 'src/modules/user/schemas/user.schema'
// Services
import { UserService } from 'src/modules/user/user.service'
import { UserSeederService } from 'src/modules/user/user-seeder.service'

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
