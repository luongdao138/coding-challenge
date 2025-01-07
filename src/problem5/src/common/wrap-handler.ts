import { NextFunction, Request, RequestHandler, Response } from 'express'

import { RouteHandler } from '../types/common'

export const wrapHandler = (fn: RouteHandler): RequestHandler => {
  return (req: Request & { errors?: Error[] }, res: Response, next: NextFunction) => {
    if (req?.errors?.length) {
      return res.status(400).json({
        errors: req.errors,
        message: 'Provided request body contains errors. Please check the data and retry the request',
      })
    }
    // eslint-disable-next-line promise/no-callback-in-promise
    return (async () => fn(req, res, next))().catch(next)
  }
}
