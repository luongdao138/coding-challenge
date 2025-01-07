import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import BookService from '../../../services/book'

export default async function (req: Request, res: Response) {
  const bookService = req.scope.resolve<BookService>(BookService.resolutionKey)

  await bookService.delete(req.params.id)

  res.sendStatus(StatusCodes.NO_CONTENT)
}
