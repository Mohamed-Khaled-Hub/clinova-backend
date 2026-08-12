// Core
import { Logger } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import serverlessExpress from '@codegenie/serverless-express'
import express, { Request, Response } from 'express'
import { setServers } from 'node:dns/promises'
import { apiName } from '../src/main'

// Override DNS for MongoDB Atlas lookups
setServers(['8.8.8.8', '1.1.1.1'])

const server = express()
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
