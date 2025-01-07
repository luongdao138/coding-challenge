import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import { AppErrorCode } from '../types/error-codes'

export type ErrorMetadata = {
  code?: AppErrorCode
}

/**
 * Standardized error to be used across the project
 * @extends Error
 */
export class AppError extends Error {
  public statusCode: StatusCodes
  public code: AppErrorCode
  public timestamp: string

  /**
   * Creates a standardized error to be used across project.
   * @param {string} type - type of error
   * @param {string} message - message to go along with error
   */
  constructor(statusCode: StatusCodes, message: string, metadata: ErrorMetadata = {}) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }

    this.statusCode = statusCode
    if (metadata.code) {
      this.code = metadata.code
    }
    this.timestamp = new Date().toISOString()
    this.message = message
  }
}

export type GlobalError = AppError | ZodError | Error
