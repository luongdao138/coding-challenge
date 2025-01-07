import cors from 'cors'
import { Router } from 'express'

import { AppContainer, ConfigModule } from '../types/common'
import errorHandler from './middlewares/error-handler'
import initBookRoutes from './routes/book'

// make sure to be accessible to all dependencies
export default function (container: AppContainer, config: ConfigModule) {
  const masterRoute = Router()
  // apply front cors to front route
  const corOrigins = (config.projectConfig.cors_origins || '').split(',')

  masterRoute.use(
    cors({
      origin: corOrigins,
    }),
  )

  // init all children route belongs to front side
  initBookRoutes(masterRoute)

  // error handlers
  masterRoute.use(errorHandler)

  return masterRoute
}
