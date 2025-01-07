import { StatusCodes } from 'http-status-codes'

import { AppError } from '../common/errors'
import { BaseEntity } from '../common/models'
import { FindConfig, QueryConfig, RequestQueryFields } from '../types/common'
import { BaseUtil } from './base-util'

export function prepareRetrieveQuery<T extends RequestQueryFields, TEntity extends BaseEntity>(
  validated: T,
  queryConfig?: QueryConfig<TEntity>,
) {
  const { fields, expand } = validated

  let expandRelations: string[] | undefined = undefined
  if (BaseUtil.isDefined(expand)) {
    expandRelations = expand.split(',').filter((v) => v)
  }

  let expandFields: (keyof TEntity)[] | undefined = undefined
  if (BaseUtil.isDefined(fields)) {
    expandFields = (fields.split(',') as (keyof TEntity)[]).filter((v) => v)
  }

  if (expandFields?.length && queryConfig?.allowedFields?.length) {
    validateFields(expandFields as string[], queryConfig.allowedFields)
  }

  if (expandRelations?.length && queryConfig?.allowedRelations?.length) {
    validateRelations(expandRelations, queryConfig.allowedRelations)
  }

  return getRetrieveConfig<TEntity>(
    queryConfig?.defaultFields as (keyof TEntity)[],
    (queryConfig?.defaultRelations ?? []) as string[],
    expandFields,
    expandRelations,
  )
}

export function getListConfig<TModel extends BaseEntity>(
  defaultFields: (keyof TModel)[],
  defaultRelations: string[],
  fields?: (keyof TModel)[],
  expand?: string[],
  limit = 50,
  offset = 0,
  order: { [k: string | symbol]: 'DESC' | 'ASC' } = {},
): FindConfig<TModel> {
  let includeFields: (keyof TModel)[] = []
  if (BaseUtil.isDefined(fields)) {
    const fieldSet = new Set(fields)
    // Ensure created_at is included, since we are sorting on this
    fieldSet.add('createdAt')
    fieldSet.add('id')
    includeFields = Array.from(fieldSet) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (BaseUtil.isDefined(expand)) {
    expandFields = expand
  }

  const orderBy = order

  if (!Object.keys(order).length) {
    orderBy['createdAt'] = 'DESC'
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: BaseUtil.isDefined(expand) ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: orderBy,
  }
}

export function getRetrieveConfig<TModel extends BaseEntity>(
  defaultFields: (keyof TModel)[],
  defaultRelations: string[],
  fields?: (keyof TModel)[],
  expand?: string[],
): FindConfig<TModel> {
  let includeFields: (keyof TModel)[] = []
  if (BaseUtil.isDefined(fields)) {
    includeFields = Array.from(new Set([...fields, 'id'])).map((field) => {
      return typeof field === 'string' ? field.trim() : field
    }) as (keyof TModel)[]
  }

  let expandFields: string[] = []
  if (BaseUtil.isDefined(expand)) {
    expandFields = expand.map((expandRelation) => expandRelation.trim())
  }

  return {
    select: includeFields.length ? includeFields : defaultFields,
    relations: BaseUtil.isDefined(expand) ? expandFields : defaultRelations,
  }
}

export function prepareListQuery<T extends RequestQueryFields, TEntity extends BaseEntity>(
  validated: T,
  queryConfig?: QueryConfig<TEntity>,
) {
  const { order, fields, expand, limit, offset } = validated

  let expandRelations: string[] | undefined = undefined
  if (BaseUtil.isDefined(expand)) {
    expandRelations = expand.split(',').filter((v) => v)
  }

  let expandFields: (keyof TEntity)[] | undefined = undefined
  if (BaseUtil.isDefined(fields)) {
    expandFields = (fields.split(',') as (keyof TEntity)[]).filter((v) => v)
  }

  if (expandFields?.length && queryConfig?.allowedFields?.length) {
    validateFields(expandFields as string[], queryConfig.allowedFields)
  }

  if (expandRelations?.length && queryConfig?.allowedRelations?.length) {
    validateRelations(expandRelations, queryConfig.allowedRelations)
  }

  let orderBy: { [k: symbol]: 'DESC' | 'ASC' } | undefined
  if (BaseUtil.isDefined(order)) {
    let orderField = order
    if (order.startsWith('-')) {
      const [, field] = order.split('-')
      orderField = field
      orderBy = { [field]: 'DESC' }
    } else {
      orderBy = { [order]: 'ASC' }
    }

    if (queryConfig?.allowedFields?.length && !queryConfig?.allowedFields.includes(orderField)) {
      throw new AppError(StatusCodes.BAD_REQUEST, `Order field ${orderField} is not valid`)
    }
  }

  return getListConfig<TEntity>(
    queryConfig?.defaultFields as (keyof TEntity)[],
    (queryConfig?.defaultRelations ?? []) as string[],
    expandFields,
    expandRelations,
    limit ?? queryConfig?.defaultLimit,
    offset ?? 0,
    orderBy,
  )
}

function validateFields(fields: string[], allowed: string[]): void | never {
  const disallowedFieldsFound: string[] = []
  fields?.forEach((field) => {
    if (!allowed.includes(field as string)) {
      disallowedFieldsFound.push(field)
    }
  })

  if (disallowedFieldsFound.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Fields [${disallowedFieldsFound.join(', ')}] are not valid`)
  }
}

function validateRelations(relations: string[], allowed: string[]): void | never {
  const disallowedRelationsFound: string[] = []
  relations?.forEach((field) => {
    if (!allowed.includes(field as string)) {
      disallowedRelationsFound.push(field)
    }
  })

  if (disallowedRelationsFound.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Relations [${disallowedRelationsFound.join(', ')}] are not valid`)
  }
}
