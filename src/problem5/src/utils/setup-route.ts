import { Router } from 'express'

import { ExpressRoute } from '../types/common'

export function setupRoute(baseRoute: Router, routes: ExpressRoute[]) {
  for (const route of routes) {
    const handlers = route.handlers

    baseRoute[route.method.toLowerCase()](route.path, ...handlers)
  }
}
