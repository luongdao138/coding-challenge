import path from 'node:path'

interface ConfigResult<T> {
  configModule: T
  error?: any
  configFilePath: string
}

/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} fileName - the name of the config file.
 * @return {object} an object containing the config module and its path as well as an error property if the config couldn't be loaded.
 */
function getConfigFile<TConfig = unknown>(rootDir: string, fileName: string): ConfigResult<TConfig> {
  const configPath = path.join(rootDir, fileName)
  let configFilePath = ''
  let configModule
  let err

  try {
    configFilePath = require.resolve(configPath)
    configModule = require(configFilePath)
  } catch (error) {
    err = error
  }

  if (configModule && typeof configModule.default === 'object') {
    configModule = configModule.default
  }

  return {
    error: err,
    configModule,
    configFilePath,
  }
}

export default getConfigFile
