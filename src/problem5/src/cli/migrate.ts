import { asValue, createContainer } from 'awilix'
import path from 'path'

import configLoader from '../loaders/config'
import databaseLoader from '../loaders/database-loader'
import { AppContainer, ConfigModule } from '../types/common'
import logger from '../utils/logger'

function getMigrations() {
  const migrationDirs: string[] = []
  const corePackageMigrations = path.resolve(path.join(__dirname, '..', 'migrations'))

  migrationDirs.push(path.join(corePackageMigrations, '*.js'))

  return {
    coreMigrations: migrationDirs,
  }
}

function getDataSource(directory: string, configModule: ConfigModule) {
  const { coreMigrations } = getMigrations()
  const container = createContainer()
  container.register('db_entities', asValue([]))

  return databaseLoader({
    container: container as AppContainer,
    configModule,
    customOptions: {
      migrations: coreMigrations,
      logging: 'all',
    },
  })
}

const handleMigrate = async () => {
  // temp remove first two elements (will be different if using cli)
  const args = process.argv.slice(2)
  const directory = process.cwd()

  // temporary run migration
  const configModule = configLoader(directory)
  const dataSource = await getDataSource(directory, configModule)

  if (args[0] === 'run') {
    logger.info('Migrations starting...')
    await dataSource.runMigrations()
    await dataSource.destroy()
    logger.info('Migrations completed!')
    process.exit()
  }
}

handleMigrate()

export default handleMigrate
