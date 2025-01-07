import 'reflect-metadata'

import { asValue } from 'awilix'
import { NextFunction, Request, Response } from 'express'

import notFoundHandler from '../api/middlewares/not-found-handler'
import { AppContainer, LoaderConfig, LoaderResult } from '../types/common'
import { createAppContainer } from '../utils/awilix-container'
import logger from '../utils/logger'
import apiLoader from './api-loader'
import loadConfig from './config'
import databaseLoader from './database-loader'
import expressLoader from './express-loader'
import modelsLoader from './models-loader'
import repositoresLoader from './repositores-loader'
import loadRequestContext from './request-context'
import servicesLoader from './services-loader'

const appLoader = async ({ expressApp, directory }: LoaderConfig): Promise<LoaderResult> => {
  const configModule = loadConfig(directory)

  // create app container (awilix DI)
  const container = createAppContainer()

  // register resolved config module to container
  container.register('configModule', asValue(configModule))
  logger.info('Config module loaded')

  // add additional information to context of the request
  loadRequestContext(expressApp)
  logger.info('Request context loaded')

  // feature flag here => currently not available

  // register logger and feature flag router
  container.register({
    logger: asValue(logger),
  })

  // load all db models
  await modelsLoader({ container })

  // create datasource and connect to db
  // currently not support sqlite (use postgresql, mysql instead)
  const dataSource = await databaseLoader({ container, configModule })

  // load all internal repositories
  await repositoresLoader({ container })

  // register datasource to container
  container.register({
    manager: asValue(dataSource.manager),
  })

  // services loader
  await servicesLoader({ container, configModule })

  // load basic epxress app config
  await expressLoader({ app: expressApp, configModule })
  // passport loader

  // Add the registered services to the request scope
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    container.register({ manager: asValue(dataSource.manager) })
    req.scope = container.createScope() as AppContainer
    next()
  })

  // apis loaders
  await apiLoader({ container, app: expressApp })

  // not found handlers
  expressApp.use('*', notFoundHandler)

  return { app: expressApp, container }
}

export default appLoader
