import { Express } from 'express'

import initMasterRoute from '../api'
import { BASE_ENDPOINT } from '../constants/api'
import { AppContainer, ConfigModule } from '../types/common'

type Options = {
  container: AppContainer
  app: Express
}

export default async function ({ app, container }: Options) {
  const configModule = container.resolve<ConfigModule>('configModule')

  app.use(BASE_ENDPOINT, initMasterRoute(container, configModule))
}
