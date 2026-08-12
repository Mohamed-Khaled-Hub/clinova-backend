// Core
import { Logger } from '@nestjs/common'
import { AppModule } from '../src/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import serverlessExpress from '@codegenie/serverless-express'
import express, { Request, Response, Handler } from 'express'
import { setServers } from 'node:dns/promises'
import { apiName } from '../src/main'

// Override DNS for MongoDB Atlas lookups
setServers(['8.8.8.8', '1.1.1.1'])

const server = express()
const logger = new Logger(`${apiName} API`)

let cachedServer: Handler

async function bootstrap(): Promise<Handler> {
    if (!cachedServer) {
        const app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server)
        )

        app.enableCors()
        await app.init()

        // Double-cast through unknown to satisfy strict linting without triggering no-unnecessary-type-assertion
        cachedServer = serverlessExpress({ app: server })
        logger.log('Application serverless instance initialized')
    }
    return cachedServer
}

export default async function handler(
    req: Request,
    res: Response
): Promise<void> {
    const serverlessApp = await bootstrap()
    serverlessApp(req, res, () => {})
}
