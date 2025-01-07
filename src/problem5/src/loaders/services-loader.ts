import path from 'node:path'

import { asFunction } from 'awilix'
import { glob } from 'glob'

import { AppContainer, ConfigModule, Logger } from '../types/common'
import formatRegistrationName from '../utils/format-registration-name'
import { loadModule } from '../utils/module'
import { normalizePath } from '../utils/normalize-path'

type Options = {
  configModule: ConfigModule
  container: AppContainer
}

export default async function ({ container }: Options) {
  const corePath = '../services/*.js'
  const coreFull = normalizePath(path.join(__dirname, corePath))
  const logger = container.resolve<Logger>('logger')

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: {
      ignored(p) {
        return p.name.includes('index.js')
      },
    },
  })
  await Promise.all(
    core.map(async (modulePath) => {
      const loaded = (await loadModule<any>(modulePath))?.default

      if (!loaded) return

      const name = formatRegistrationName(modulePath)

      container.register({
        [name]: asFunction((cradle) => {
          return new loaded(cradle)
        }),
      })

      logger.info(`[Server]  [ServicesLoader]  [Service loaded] - ${name}`)
    }),
  )
}
