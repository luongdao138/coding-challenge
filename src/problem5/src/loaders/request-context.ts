import { Express, NextFunction, Request, Response } from 'express'
import requestIp from 'request-ip'

export default async function (app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const ipAddress = requestIp.getClientIp(req)

    req.requestContext = {
      ip_address: ipAddress,
    }

    next()
  })
}
