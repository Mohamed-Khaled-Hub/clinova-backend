// Core
import { BadRequestException, Injectable } from '@nestjs/common'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
        folderName: string = 'app_uploads'
    ): Promise<UploadApiResponse> {
        if (!file || !file.buffer || !file.mimetype) {
            throw new BadRequestException(
                'Invalid file object provided: missing buffer or mimetype data.'
            )
        }

        const base64Image = file.buffer.toString('base64')
        const dataUri = `data:${file.mimetype};base64,${base64Image}`

        try {
            return await cloudinary.uploader.upload(dataUri, {
                folder: folderName,
                resource_type: 'image',
            })
        } catch (error) {
            throw new BadRequestException(`Cloudinary upload failed: ${error}`)
        }
    }

    async deleteImage(publicId: string): Promise<any> {
        if (!publicId) {
            throw new BadRequestException(
                'A public ID must be provided for asset deletion.'
            )
        }

        try {
            return await cloudinary.uploader.destroy(publicId)
        } catch (error) {
            throw new BadRequestException(
                `Cloudinary deletion failed: ${error}`
            )
        }
    }
}
