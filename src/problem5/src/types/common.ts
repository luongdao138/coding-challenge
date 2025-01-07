import 'reflect-metadata'

import { AwilixContainer } from 'awilix'
import { Express } from 'express'
import { NextFunction, Request, Response } from 'express'
import {
  DatabaseType,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsSelect,
  FindOptionsWhere,
  LoggerOptions,
} from 'typeorm'
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder'
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations'
import { Logger as _Logger } from 'winston'

import { BaseEntity } from '../common/models/base-entity'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      scope: AppContainer
      requestContext: Record<string, any>
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
      allowedProperties: string[]
      includes?: Record<string, boolean>
    }
  }
}

/**
 * Utility type used to remove some optional attributes (coming from K) from a type T
 */
export type WithRequiredProperty<T, K extends keyof T> = T & {
  // -? removes 'optional' from a property
  [Property in K]-?: T[Property]
}

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export type Writable<T> = {
  -readonly [key in keyof T]: T[key] | FindOperator<T[key]> | FindOperator<T[key][]> | FindOperator<string[]>
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: { [K: string]: 'ASC' | 'DESC' }
}

export type ExtendedFindConfig<TEntity> = (
  | Omit<FindOneOptions<TEntity>, 'where' | 'relations' | 'select'>
  | Omit<FindManyOptions<TEntity>, 'where' | 'relations' | 'select'>
) & {
  select?: FindOptionsSelect<TEntity>
  relations?: FindOptionsRelations<TEntity>
  where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[]
  order?: FindOptionsOrder<TEntity>
  skip?: number
  take?: number
}

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string }
export type TreeQuerySelector<TEntity> = QuerySelector<TEntity> & {
  include_descendants_tree?: boolean
}

export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    // | DateComparisonOperator
    // | StringComparisonOperator
    // | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>
}
export interface CustomFindOptions<TModel, InKeys extends keyof TModel> {
  select?: FindManyOptions<TModel>['select']
  where?: FindManyOptions<TModel>['where'] & {
    [P in InKeys]?: TModel[P][]
  }
  order?: { [K: string]: 'ASC' | 'DESC' }
  skip?: number
  take?: number
}

export type QueryConfig<TEntity extends BaseEntity> = {
  defaultFields?: (keyof TEntity | string)[]
  defaultRelations?: string[]
  allowedFields?: string[]
  allowedRelations?: string[]
  defaultLimit?: number
  isList?: boolean
}

export type RequestQueryFields = {
  expand?: string
  fields?: string
  offset?: number
  limit?: number
  order?: string
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export type DeleteResponse = {
  id: string
  object: string
  deleted: boolean
}

export class EmptyQueryParams {}

export type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>
export type RouteMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS'
export interface ExpressRoute {
  path: string
  handlers: RouteHandler[]
  method: RouteMethod
}

export type AppContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => AppContainer
  createScope: () => AppContainer
}

export type LoaderConfig = {
  directory: string
  expressApp: Express
  isTest?: boolean
}

export type LoaderResult = {
  app: Express
  container: AppContainer
}

export type ConfigModule = {
  projectConfig: {
    database_url?: string
    database_ssl?: boolean
    database_type: DatabaseType
    database_database?: string
    database_schema?: string
    database_logging: LoggerOptions
    http_logging?: boolean

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    cors_origins?: string
    port?: number
  }
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}
