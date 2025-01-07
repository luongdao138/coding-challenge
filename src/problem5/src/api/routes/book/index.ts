import { Router } from 'express'

import { wrapHandler } from '../../../common/wrap-handler'
import { ExpressRoute } from '../../../types/common'
import { setupRoute } from '../../../utils/setup-route'
import { listBookValidator } from '../../data/validators/book'
import { transformQuery } from '../../middlewares/transform-query'

const bookRoute = Router()

const routes: ExpressRoute[] = [
  {
    path: '/',
    method: 'POST',
    handlers: [wrapHandler(require('./create').default)],
  },
  {
    path: '/:id',
    handlers: [wrapHandler(require('./detail').default)],
    method: 'GET',
  },
  {
    path: '/',
    handlers: [transformQuery(listBookValidator, { isList: true }), wrapHandler(require('./list').default)],
    method: 'GET',
  },
  {
    path: '/:id',
    handlers: [wrapHandler(require('./update').default)],
    method: 'PATCH',
  },
  {
    path: '/:id',
    handlers: [wrapHandler(require('./delete').default)],
    method: 'DELETE',
  },
]

export default async function (baseRoute: Router) {
  setupRoute(bookRoute, routes)

  baseRoute.use('/books', bookRoute)
  return baseRoute
}
