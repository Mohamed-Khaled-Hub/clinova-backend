// Core
import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ExpressAdapter } from '@nestjs/platform-express'
import express, { Request, Response } from 'express'
import { setServers } from 'node:dns/promises'

// Filters
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter'
// Modules
import { AppModule } from './app.module'

// Override DNS for MongoDB Atlas lookups in serverless
setServers(['8.8.8.8', '1.1.1.1'])

// API Name
export const apiName = 'Clinova'

// Logger
const logger = new Logger(`${apiName} API`)

// Express instance and caching flag for serverless
const server = express()
let isInitialized = false

// Single bootstrap configuration applied to both local & serverless runtimes
function configureApp(
    app: ReturnType<typeof NestFactory.create> extends Promise<infer T>
        ? T
        : never
) {
    app.enableCors({
        origin: [
            'https://clinova-frontend-nine.vercel.app',
            'http://localhost:3000',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    })

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
}

// Serverless Handler Bootstrap (Vercel)
async function bootstrapServerless(): Promise<express.Express> {
    if (!isInitialized) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server)
        )

        configureApp(app)
        await app.init()

        isInitialized = true
        logger.log('Application serverless instance initialized')
    }
    return server
}

// Local Standalone Bootstrap (npm run start:dev)
async function bootstrapLocal() {
    const app = await NestFactory.create(AppModule)
    configureApp(app)

    const port = process.env.PORT ?? 3000
    await app.listen(port, '0.0.0.0')
    logger.log(`Application is running on port ${port}`)
}

// Vercel Serverless Function Export
export default async function handler(
    req: Request,
    res: Response
): Promise<void> {
    const expressApp = await bootstrapServerless()
    expressApp(req, res)
}

// Run standalone server ONLY if executed directly (not imported as a module by Vercel)
if (!process.env.VERCEL) {
    bootstrapLocal().catch((err: unknown) => console.error(err))
}
