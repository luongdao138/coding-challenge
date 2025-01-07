import { ConfigModule } from '../types/common'
import getConfigFile from '../utils/get-config-file'
import logger from '../utils/logger'

function handleConfigError(error: Error) {
  logger.error(`Error when loading config: ${error.message}`)

  if (error.stack) {
    logger.error(error.stack)
  }

  process.exit(1)
}

export default function (rootDirectory: string): ConfigModule {
  const { configModule, error } = getConfigFile<ConfigModule>(rootDirectory, 'app-config.js')

  if (error) {
    handleConfigError(error)
  }

  if (!configModule?.projectConfig?.database_type) {
    logger.warn(`[app-config] ⚠️ database_type not found. fallback to default postgres.`)
  }

  return {
    projectConfig: {
      ...configModule.projectConfig,
    },
  }
}
