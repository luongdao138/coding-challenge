import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { z } from 'zod'

import { BaseEntity } from '../../common/models'
import { FindConfig, QueryConfig, RequestQueryFields } from '../../types/common'
import { prepareListQuery, prepareRetrieveQuery } from '../../utils/get-query-config'
import { removeUndefinedProperties } from '../../utils/remove-undefined-properties'
import normalizedQuery from './normalized-query'

export function transformQuery<T extends RequestQueryFields, TEntity extends BaseEntity>(
  validator: z.ZodObject<any>,
  queryConfig?: Omit<QueryConfig<TEntity>, 'allowedRelations' | 'allowedFields'>,
  config: Partial<z.ParseParams> = {},
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      normalizedQuery()(req, res, () => void 0)
      const validated = validator.parse(req.query, config) as T
      req.validatedQuery = validated
      req.filterableFields = getFilterableFields(validated)
      req.allowedProperties = getAllowedProperties(validated, req.includes ?? {}, queryConfig)
      attachListOrRetrieveConfig<TEntity>(req, queryConfig)

      next()
    } catch (e) {
      next(e)
    }
  }
}

function getFilterableFields<T extends RequestQueryFields>(obj: T): T {
  const result = omit(obj, ['limit', 'offset', 'expand', 'fields', 'order']) as T
  return removeUndefinedProperties(result)
}

function attachListOrRetrieveConfig<TEntity extends BaseEntity>(req: Request, queryConfig?: QueryConfig<TEntity>) {
  const validated = req.validatedQuery
  if (queryConfig?.isList) {
    req.listConfig = prepareListQuery(validated, queryConfig) as FindConfig<unknown>
  } else {
    req.retrieveConfig = prepareRetrieveQuery(validated, queryConfig) as FindConfig<unknown>
  }
}

function getAllowedProperties<TEntity extends BaseEntity>(
  validated: RequestQueryFields,
  includesOptions: Record<string, boolean>,
  queryConfig?: QueryConfig<TEntity>,
): string[] {
  const allowed: (string | keyof TEntity)[] = []

  const includeKeys = Object.keys(includesOptions)
  const fields = validated.fields ? validated.fields?.split(',') : queryConfig?.defaultFields || []
  const expand =
    validated.expand || includeKeys.length
      ? [...(validated.expand?.split(',') || []), ...includeKeys]
      : queryConfig?.defaultRelations || []

  allowed.push(...fields, ...expand)

  return allowed as string[]
}
