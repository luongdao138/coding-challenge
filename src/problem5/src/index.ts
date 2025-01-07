import express from 'express'

import { AppServer } from './bootstrap/app'

const bootstrap = async () => {
  const app = express()
  const directory = process.cwd()

  const server = new AppServer(directory, app)

  await server.run()
}

bootstrap()
