import express, { Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { ConfigModule } from '../types/common'
import logger from '../utils/logger'

type Options = {
  app: Express
  configModule?: ConfigModule
}

export default async function ({ app, configModule }: Options) {
  app.set('trust proxy', 1)

  app.use((req, res, next) => {
    // not convert req.body in webhook endpoint
    if (req.url.endsWith('webhook')) {
      next()
      return
    }

    express.json()(req, res, next)
  })

  app.use(helmet())
  app.use(
    morgan('combined', {
      stream: logger.loggerInstance_.stream as any,
      skip: () => process.env.NODE_ENV === 'test' || !configModule?.projectConfig?.http_logging,
    }),
  )

  app.get('/health', (req, res) => {
    res.status(200).json({ msg: 'Welcome to CRUD app!' })
  })

  return app
}
