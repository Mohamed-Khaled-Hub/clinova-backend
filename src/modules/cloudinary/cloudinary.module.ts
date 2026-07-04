// Core
import { Module } from '@nestjs/common'
// Providers
import { CloudinaryProvider } from './cloudinary.provider'
// Services
import { CloudinaryService } from './cloudinary.service'

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
