// Core
import { Logger } from '@nestjs/common'
// CHANGE THIS: import { AppModule } from '@/app.module'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import serverlessExpress from '@codegenie/serverless-express'
import express, { Request, Response } from 'express'
// Variables
// CHANGE THIS: import { apiName } from '@/main'
import { apiName } from '../src/main'

// Express Server
const server = express()

// Logger
const logger = new Logger(`${apiName} API`)

type ServerlessApp = ReturnType<typeof serverlessExpress>

let cachedServer: ServerlessApp

async function bootstrap(): Promise<ServerlessApp> {
    if (!cachedServer) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server)
        )

        app.enableCors()
        await app.init()

        cachedServer = serverlessExpress({ app: server })
        logger.log('Application serverless instance initialized')
    }
    return cachedServer
}

export default async function handler(req: Request, res: Response) {
    const serverlessApp = await bootstrap()
    return serverlessApp(req, res)
}
