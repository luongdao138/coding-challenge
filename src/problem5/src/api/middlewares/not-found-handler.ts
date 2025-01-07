import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { AppError } from '../../common/errors'
import { formatException } from '../../utils/format-exception'

export default function (req: Request, res: Response) {
  const notFoundError = new AppError(StatusCodes.NOT_FOUND, 'Resource not found!')
  const formattedError = formatException(notFoundError)

  res.status(+formattedError.statusCode).json(formattedError)
}
