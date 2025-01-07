/* eslint-disable */

const dotenv = require('dotenv-safe')

let ENV_FILE_NAME = ''
switch (process.env.NODE_ENV) {
  case 'production':
    ENV_FILE_NAME = '.env.production'
    break
  case 'staging':
    ENV_FILE_NAME = '.env.staging'
    break
  case 'test':
    ENV_FILE_NAME = '.env.test'
    break
  case 'development':
  default:
    ENV_FILE_NAME = '.env'
    break
}

try {
  dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME })
} catch (e) {}

const PORT = Number(process.env.PORT) || 9000
// cors
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001'

// db
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'postgres'
const DATABASE_LOGGING = process.env.DATABASE_LOGGING || false
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/crud-dev'
const DATABASE_SSL = process.env.DATABASE_SSL === 'true'

const HTTP_LOGGING = process.env.HTTP_LOGGING === 'true'

/** @type {import('./src/types/common').ConfigModule['projectConfig']} */
const projectConfig = {
  port: PORT,
  database_type: DATABASE_TYPE,
  database_url: DATABASE_URL,
  database_ssl: DATABASE_SSL,
  database_logging: DATABASE_LOGGING,
  http_logging: HTTP_LOGGING,
  cors_origins: CORS_ORIGIN,
}

/** @type {import('./src/types/common').ConfigModule} */
module.exports = {
  projectConfig,
}
