// Core
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
// Filters
import { GlobalExceptionFilter } from '@/common/filters/global-exception/global-exception.filter'
// Modules
import { AppModule } from '@/app.module'

// API Name
const apiName = 'Clinova'

// Logger
const logger = new Logger(`${apiName} API`)

// Bootstrap
async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle(`${apiName} API`)
        .setDescription(
            `${apiName} clinic management backend API documentation`
        )
        .setVersion('1.0')
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('api', app, documentFactory)

    app.useGlobalFilters(new GlobalExceptionFilter())

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    )

    await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
    .then(() => {
        logger.log(`Application is running on port ${process.env.PORT ?? 3000}`)
    })
    .catch((err: unknown) => console.error(err))
