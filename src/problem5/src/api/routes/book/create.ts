import { Request, Response } from 'express'

import BookService from '../../../services/book'
import { BookMapper } from '../../data/mappers/book'
import { BookValidator } from '../../data/validators/book'

export default async function (req: Request, res: Response) {
  const validated = BookValidator.create(req.body)
  const bookService = req.scope.resolve<BookService>(BookService.resolutionKey)

  const result = await bookService.create(validated)

  res.json(BookMapper.entityToResponse(result))
}
