import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import { AppError, GlobalError } from '../common/errors'

export enum PostgresError {
  DUPLICATE_ERROR = '23505',
  FOREIGN_KEY_ERROR = '23503',
  SERIALIZATION_FAILURE = '40001',
  NULL_VIOLATION = '23502',
}

/**
 * Format error before return to user
 * @param err Error object to convert to standardized app error
 * @returns Standardized app error
 */
export function formatException(err: GlobalError): AppError {
  let message = err.message ?? 'Unknown error occured!'

  let statusCode: StatusCodes

  if (err instanceof AppError || 'statusCode' in err) {
    statusCode = err.statusCode as StatusCodes
  } else if (err instanceof ZodError) {
    // validation error
    const zodFormattedError = err.issues
    statusCode = StatusCodes.BAD_REQUEST
    message = zodFormattedError[0].message ?? 'Unknown error occured!'
  } else {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }

  const formattedErr: AppError = new AppError(statusCode, message)
  if ('code' in err && !!err.code) {
    formattedErr.code = err.code as number
  }

  return { ...formattedErr }
}
