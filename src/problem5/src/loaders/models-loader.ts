import { asClass, asValue } from 'awilix'
import { glob } from 'glob'
import path from 'path'
import { EntitySchema } from 'typeorm'

import { AppContainer, ClassConstructor, Logger } from '../types/common'
import formatRegistrationName from '../utils/format-registration-name'
import { loadModule } from '../utils/module'
import { normalizePath } from '../utils/normalize-path'

type Options = {
  container: AppContainer
  isTest?: boolean
}

type LoadedModule = ClassConstructor<unknown> | EntitySchema

export default async function ({ container }: Options, config = { register: true }) {
  const corePath = '../models/*.js'
  const coreFull = normalizePath(path.join(__dirname, corePath))

  const logger = container.resolve<Logger>('logger')

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: {
      ignored(p) {
        return p.name.includes('index.js') || p.name.includes('index.ts')
      },
    },
  })

  const modules: LoadedModule[] = []

  await Promise.all(
    core.map(async (modulePath) => {
      const loaded = await loadModule<LoadedModule>(modulePath)

      if (loaded) {
        Object.entries(loaded).map(([, val]: [string, LoadedModule]) => {
          if ((typeof val === 'function' || val instanceof EntitySchema) && config.register) {
            const moduleName = formatRegistrationName(modulePath)

            container.register({
              [moduleName]: asClass(val as ClassConstructor<unknown>),
            })

            container.registerAdd('db_entities', asValue(val))

            modules.push(val)

            logger.info(`[Server]  [EntiesLoader]  [Entity loaded] - ${moduleName}`)
          }
        })
      }
    }),
  )

  return modules
}
