import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { EntityManager, FindOptionsWhere, ILike, In } from 'typeorm'

import { BookMapper } from '../api/data/mappers/book'
import { CreateBookInput, FilterableBookProps, UpdateBookInput } from '../api/data/validators/book'
import { AppError } from '../common/errors'
import { Book } from '../models/book'
import BookRepository from '../repositories/book'
import { FindConfig, Selector } from '../types/common'
import { BaseUtil } from '../utils/base-util'
import { buildQuery } from '../utils/build-query'
import formatRegistrationName from '../utils/format-registration-name'
import { TransactionBaseService } from './transaction-base'

type InjectionDependencies = {
  manager: EntityManager
  bookRepository: typeof BookRepository
}

export default class BookService extends TransactionBaseService {
  static resolutionKey = formatRegistrationName(path.resolve(__dirname, __filename))

  protected bookRepo_: typeof BookRepository

  constructor(container: InjectionDependencies) {
    super(container)

    this.bookRepo_ = container.bookRepository
  }

  async create(input: CreateBookInput): Promise<Book> {
    return this.atomicPhase_(async (manager) => {
      const bookRepo = manager.withRepository(this.bookRepo_)

      const book = await bookRepo.save(BookMapper.requestToEnity(input))
      return book
    })
  }

  async retrieve(id: string, config: FindConfig<Book> = {}): Promise<Book> {
    const query = buildQuery({ id }, config)

    const book = await this.bookRepo_.findOne(query)

    if (!book) {
      throw new AppError(StatusCodes.NOT_FOUND, `Book with id: ${id} not found`)
    }

    return book
  }

  async update(id: string, input: UpdateBookInput): Promise<Book> {
    return this.atomicPhase_(async (manager) => {
      const existBook = await this.retrieve(id)
      const bookRepo = manager.withRepository(this.bookRepo_)

      for (const [k, v] of Object.entries(input)) {
        if (BaseUtil.isDefined(v)) {
          existBook[k] = v
        }
      }

      return bookRepo.save(existBook)
    })
  }

  async delete(id: string | string[]): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const bookRepo = manager.withRepository(this.bookRepo_)
      if (Array.isArray(id)) {
        await bookRepo.delete({ id: In(id) })
      } else {
        await bookRepo.delete({ id: id })
      }
    })
  }

  async listAndCount(
    selector: FilterableBookProps = {},
    config: FindConfig<Book> = {
      take: 20,
      skip: 0,
      order: { createdAt: 'DESC' },
    },
  ): Promise<[Book[], number]> {
    const bookRepo = this.activeManager_.withRepository(this.bookRepo_)
    let title: string | undefined

    if ('title' in selector) {
      title = selector.title
      delete selector.title
    }

    const query = buildQuery(selector as Selector<Book>, config)

    if (title) {
      query.where = query.where as FindOptionsWhere<Book>
      query.where.title = ILike(`%${title}%`)
    }

    const [books, count] = await bookRepo.findAndCount(query)
    return [books, count]
  }
}
