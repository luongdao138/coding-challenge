import { ColumnType } from 'typeorm'

export function resolveDbType(pgSqlType: ColumnType): ColumnType {
  return pgSqlType
}
