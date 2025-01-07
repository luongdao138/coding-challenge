import { Book } from '../../../models/book'
import { BookResponse } from '../../../types/book'
import { CreateBookInput } from '../validators/book'

export class BookMapper {
  static requestToEnity(request: CreateBookInput): Book {
    const book = new Book()

    book.title = request.title
    book.author = request.author
    book.price = request.price
    book.isSoldOut = request.isSoldOut

    return book
  }

  static entityToResponse(entity: Book): BookResponse {
    return {
      id: entity.id,
      author: entity.author,
      title: entity.title,
      isSoldOut: entity.isSoldOut,
      price: entity.price,
      publishedAt: entity.publishedAt,
    }
  }
}
