import _ from 'lodash'
import {
  FindManyOptions,
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm'
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder'

import { ExtendedFindConfig, FindConfig } from '../types/common'

function isObject(obj: any) {
  return _.isObject(obj)
}

export function buildQuery<TWhereKeys extends object, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {},
) {
  const query: ExtendedFindConfig<TEntity> = {
    where: buildWhere<TWhereKeys, TEntity>(selector),
  }

  if ('deletedAt' in selector) {
    query.withDeleted = true
  }

  if ('skip' in config) {
    ;(query as FindManyOptions<TEntity>).skip = config.skip
  }

  if ('take' in config) {
    ;(query as FindManyOptions<TEntity>).take = config.take
  }

  if (config.relations) {
    query.relations = buildRelations<TEntity>(config.relations)
  }

  if (config.select) {
    query.select = buildSelects<TEntity>(config.select as string[])
  }

  if (config.order) {
    query.order = buildOrder<TEntity>(config.order)
  }

  return query
}

function buildWhere<TWhereKeys extends object, TEntity>(constraints: TWhereKeys): FindOptionsWhere<TEntity> {
  const where: FindOptionsWhere<TEntity> = {}
  for (const [key, value] of Object.entries(constraints)) {
    if (value === undefined) {
      continue
    }

    if (value === null) {
      where[key] = IsNull()
      continue
    }

    if (value instanceof FindOperator) {
      where[key] = value
      continue
    }

    if (Array.isArray(value)) {
      where[key] = In(value)
      continue
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([objectKey, objectValue]) => {
        switch (objectKey) {
          case 'lt':
            where[key] = LessThan(objectValue)
            break
          case 'gt':
            where[key] = MoreThan(objectValue)
            break
          case 'lte':
            where[key] = LessThanOrEqual(objectValue)
            break
          case 'gte':
            where[key] = MoreThanOrEqual(objectValue)
            break
          default:
            if (objectValue != undefined && typeof objectValue === 'object') {
              where[key] = buildWhere<any, TEntity>(objectValue)
              return
            }
            where[key] = value
        }
        return
      })

      continue
    }

    where[key] = value
  }

  return where
}

export function buildLegacyFieldsListFrom<TEntity>(
  input:
    | FindOptionsWhere<TEntity>
    | FindOptionsSelect<TEntity>
    | FindOptionsOrder<TEntity>
    | FindOptionsRelations<TEntity> = {},
): (keyof TEntity)[] {
  if (!Object.keys(input).length) {
    return []
  }

  const output: Set<string> = new Set(Object.keys(input))

  for (const key of Object.keys(input)) {
    if (input[key] != undefined && typeof input[key] === 'object') {
      const deepRes = buildLegacyFieldsListFrom(input[key])

      const items = deepRes.reduce((acc, val) => {
        acc.push(`${key}.${val}`)
        return acc
      }, [] as string[])

      items.forEach((item) => output.add(item))
      continue
    }

    output.add(key)
  }

  return Array.from(output) as (keyof TEntity)[]
}

export function buildSelects<TEntity>(selectCollection: string[]): FindOptionsSelect<TEntity> {
  return buildRelationsOrSelect(selectCollection) as FindOptionsSelect<TEntity>
}

export function buildRelations<TEntity>(relationCollection: string[]): FindOptionsRelations<TEntity> {
  return buildRelationsOrSelect(relationCollection) as FindOptionsRelations<TEntity>
}

export function addOrderToSelect<TEntity>(order: FindOptionsOrder<TEntity>, select: FindOptionsSelect<TEntity>): void {
  for (const orderBy of Object.keys(order)) {
    if (isObject(order[orderBy])) {
      select[orderBy] = select[orderBy] && isObject(select[orderBy]) ? select[orderBy] : {}
      addOrderToSelect(order[orderBy], select[orderBy])
      continue
    }

    select[orderBy] = isObject(select[orderBy]) ? { ...select[orderBy], id: true, [orderBy]: true } : true
  }
}

function buildRelationsOrSelect<TEntity>(
  collection: string[],
): FindOptionsRelations<TEntity> | FindOptionsSelect<TEntity> {
  const output: FindOptionsRelations<TEntity> | FindOptionsSelect<TEntity> = {}

  for (const relation of collection) {
    if (relation.indexOf('.') > -1) {
      const nestedRelations = relation.split('.')

      let parent = output

      while (nestedRelations.length > 1) {
        const nestedRelation = nestedRelations.shift() as string
        parent = parent[nestedRelation] =
          parent[nestedRelation] !== true && typeof parent[nestedRelation] === 'object' ? parent[nestedRelation] : {}
      }

      parent[nestedRelations[0]] = true

      continue
    }

    output[relation] = output[relation] ?? true
  }

  return output
}

function buildOrder<TEntity>(orderBy: { [k: string]: 'ASC' | 'DESC' }): FindOptionsOrder<TEntity> {
  const output: FindOptionsOrder<TEntity> = {}

  const orderKeys = Object.keys(orderBy)

  for (const order of orderKeys) {
    if (order.indexOf('.') > -1) {
      const nestedOrder = order.split('.')

      let parent = output

      while (nestedOrder.length > 1) {
        const nestedRelation = nestedOrder.shift() as string
        parent = parent[nestedRelation] = parent[nestedRelation] ?? {}
      }

      parent[nestedOrder[0]] = orderBy[order]

      continue
    }

    output[order] = orderBy[order]
  }

  return output
}

export function nullableValue(value: any): FindOperator<any> {
  if (value === null) {
    return IsNull()
  } else {
    return value
  }
}
