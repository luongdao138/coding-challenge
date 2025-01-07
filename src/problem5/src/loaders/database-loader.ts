import { DataSource, DataSourceOptions } from 'typeorm'

import { AppContainer, ConfigModule } from '../types/common'

type Options = {
  container: AppContainer
  configModule: ConfigModule
  customOptions?: {
    migrations: DataSourceOptions['migrations']
    logging: DataSourceOptions['logging']
  }
}

export let dataSource: DataSource

export default async function ({ container, configModule, customOptions }: Options): Promise<DataSource> {
  // get all entities from awilix container
  const entities = container.resolve('db_entities')

  const requireSSL = Boolean(configModule.projectConfig.database_ssl)

  // init typeorm dataSource (not support sqlite)
  dataSource = new DataSource({
    type: configModule?.projectConfig.database_type ?? 'postgres',
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: requireSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    schema: configModule.projectConfig.database_schema,
    entities,
    migrations: customOptions?.migrations,
    logging: customOptions?.logging ?? configModule.projectConfig.database_logging ?? false,
  } as DataSourceOptions)

  await dataSource.initialize()

  return dataSource
}
