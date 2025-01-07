import { DeleteDateColumn } from 'typeorm'

import { resolveDbType } from '../db-column'
import { BaseEntity } from './base-entity'

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: resolveDbType('timestamptz') })
  deletedAt: Date | null
}
