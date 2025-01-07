import path from 'node:path'

import { asValue } from 'awilix'
import { glob } from 'glob'

import { AppContainer, Logger } from '../types/common'
import formatRegistrationName from '../utils/format-registration-name'
import { loadModule } from '../utils/module'
import { normalizePath } from '../utils/normalize-path'

type Options = {
  container: AppContainer
}

export default async function ({ container }: Options) {
  const corePath = '../repositories/*.js'
  const coreFull = normalizePath(path.join(__dirname, corePath))
  const logger = container.resolve<Logger>('logger')

  const core = glob.sync(coreFull, { cwd: __dirname })

  await Promise.all(
    core.map(async (modulePath) => {
      const loaded = (await loadModule<any>(modulePath)).default

      if (typeof loaded === 'object') {
        const registrationName = formatRegistrationName(modulePath)
        container.register({
          [registrationName]: asValue(loaded),
        })

        logger.info(`[Server]  [RepositoriesLoader]  [Repository loaded] - ${registrationName}`)
      }
    }),
  )
}
