import { dataSource } from '../loaders/database-loader'
import { Book } from '../models/book'

export const BookRepository = dataSource.getRepository(Book)
export default BookRepository
