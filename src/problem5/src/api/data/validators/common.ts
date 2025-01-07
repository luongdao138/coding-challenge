import { z } from 'zod'

export const paginationValidator = z.object({
  offset: z.coerce.number().default(0),
  limit: z.coerce.number().default(20),
})
