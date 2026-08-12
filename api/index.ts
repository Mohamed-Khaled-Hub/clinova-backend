// Core
import { Logger } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import express, { Request, Response } from 'express'
import { setServers } from 'node:dns/promises'
import { apiName } from '../src/main'

// Override DNS for MongoDB Atlas lookups
setServers(['8.8.8.8', '1.1.1.1'])

const server = express()
const logger = new Logger(`${apiName} API`)

let isInitialized = false

async function bootstrap(): Promise<express.Express> {
    if (!isInitialized) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server)
        )

        app.enableCors()
        await app.init()

        isInitialized = true
        logger.log('Application serverless instance initialized')
    }
    return server
}

export default async function handler(
    req: Request,
    res: Response
): Promise<void> {
    const expressApp = await bootstrap()
    // Forward Vercel's native req/res directly to Express
    expressApp(req, res)
}
