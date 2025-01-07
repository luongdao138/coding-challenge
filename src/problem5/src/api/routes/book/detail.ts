import { Request, Response } from 'express'

import BookService from '../../../services/book'
import { BookMapper } from '../../data/mappers/book'

export default async function (req: Request, res: Response) {
  const bookService = req.scope.resolve<BookService>(BookService.resolutionKey)

  const result = await bookService.retrieve(req.params.id)

  res.json(BookMapper.entityToResponse(result))
}
