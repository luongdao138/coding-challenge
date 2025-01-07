import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { resolveDbType } from '../db-column'

/**
 * Base abstract entity for all entities
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: resolveDbType('timestamptz') })
  createdAt: Date

  @UpdateDateColumn({ type: resolveDbType('timestamptz') })
  updatedAt: Date
}
