import { Express } from 'express'

import appLoader from '../loaders'
import configLoader from '../loaders/config'
import { ConfigModule, Logger } from '../types/common'
import { GracefulShutdownServer } from './graceful-shutdown-server'

export class AppServer {
  private configModule: ConfigModule
  private directory: string
  protected port: number
  private app: Express

  static DEFAULT_PORT = 9000

  constructor(directory: string, app: Express, port?: number) {
    this.directory = directory
    this.app = app

    this.init(port)
  }

  private init(port?: number) {
    this.configModule = configLoader(this.directory)
    this.port = port ? port : this.configModule.projectConfig.port ?? AppServer.DEFAULT_PORT
  }

  public async run() {
    try {
      const { container } = await appLoader({ directory: this.directory, expressApp: this.app })
      const logger = container.resolve<Logger>('logger')

      const server = GracefulShutdownServer.create(
        this.app.listen(this.port, () => {
          logger.info(`Server listening on port ${this.port}`)
        }),
      )

      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(() => {
            logger.info('Gracefully stopping the server.')
            return process.exit(0)
          })
          .catch((e) => {
            logger.error('Error received when shutting down the server.', e)
            return process.exit(1)
          })
      }
      process.on('SIGTERM', gracefulShutDown)
      process.on('SIGINT', gracefulShutDown)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error starting server.', error)
      process.exit(1)
    }
  }
}
