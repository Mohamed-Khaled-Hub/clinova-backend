// Core
import { Logger } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import serverlessExpress from '@codegenie/serverless-express'
import express from 'express'
// Variables
import { apiName } from '@/main'

// Express Server
const server = express()

// Logger
const logger = new Logger(`${apiName} API`)

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server))

    app.enableCors()
    await app.init()
}

// Bootstrap
bootstrap()
    .then(() => {
        logger.log(`Application is running on port ${process.env.PORT ?? 3000}`)
    })
    .catch((err: unknown) => console.error(err))

export default serverlessExpress({ app: server })
