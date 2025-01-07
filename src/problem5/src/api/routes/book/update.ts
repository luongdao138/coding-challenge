import { Request, Response } from 'express'

import BookService from '../../../services/book'
import { BookMapper } from '../../data/mappers/book'
import { BookValidator } from '../../data/validators/book'

export default async function (req: Request, res: Response) {
  const validated = BookValidator.update(req.body)
  const bookService = req.scope.resolve<BookService>(BookService.resolutionKey)

  const result = await bookService.update(req.params.id, validated)

  res.json(BookMapper.entityToResponse(result))
}
