import { z } from 'zod'

import { paginationValidator } from './common'

export const createBookValidator = z.object({
  title: z.string({ required_error: 'Title is required' }).trim(),
  author: z.string({ required_error: 'Author is required' }).trim(),
  price: z.number({ required_error: 'Price is required' }).min(0, 'Price must be >= 0'),
  isSoldOut: z.boolean().optional(),
})

export const updateBookValidator = createBookValidator.partial().extend({
  publishedAt: z.coerce.date().optional(),
})

export const filterableListBookValidator = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isSoldOut: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === null) return undefined
      return ['true', '1'].includes(val)
    }),
})

export const listBookValidator = filterableListBookValidator.merge(paginationValidator)

export class BookValidator {
  static create(body: any) {
    return createBookValidator.parse(body)
  }

  static update(body: any) {
    return updateBookValidator.parse(body)
  }
}

export type CreateBookInput = z.infer<typeof createBookValidator>
export type UpdateBookInput = z.infer<typeof updateBookValidator>
export type FilterableBookProps = z.infer<typeof filterableListBookValidator>
