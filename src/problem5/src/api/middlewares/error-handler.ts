import { Request, Response } from 'express'

import { GlobalError } from '../../common/errors'
import { Logger } from '../../types/common'
import { BaseUtil } from '../../utils/base-util'
import { formatException } from '../../utils/format-exception'

const ALLOWED_STATUS_CODES = [500]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function (error: GlobalError, req: Request, res: Response, next) {
  const logger = req.scope.resolve<Logger>('logger')

  const formattedError = formatException(error)

  // only log error with status code = 500 in production
  const shoudLogError = BaseUtil.isDev() || ALLOWED_STATUS_CODES.includes(Number(formattedError.statusCode))

  if (shoudLogError) {
    logger.error(formattedError)
  }

  return res.status(Number(formattedError.statusCode)).json(formattedError)
}
