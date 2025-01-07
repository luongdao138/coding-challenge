import { Request, Response } from 'express'

import BookService from '../../../services/book'
import { BookMapper } from '../../data/mappers/book'

export default async function (req: Request, res: Response) {
  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const bookService = req.scope.resolve<BookService>(BookService.resolutionKey)
  const [books, count] = await bookService.listAndCount(filterableFields, listConfig)

  res.status(200).json({
    items: books.map((book) => BookMapper.entityToResponse(book)),
    count,
    offset: skip,
    limit: take,
  })
}
