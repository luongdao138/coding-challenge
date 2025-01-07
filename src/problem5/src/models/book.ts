import { Column, Entity } from 'typeorm'

import { SoftDeletableEntity } from '../common/models'

@Entity()
export class Book extends SoftDeletableEntity {
  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'varchar', nullable: false })
  author: string

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date

  @Column({ type: 'int4', nullable: true })
  price: number

  @Column({ type: 'bool', nullable: true })
  isSoldOut?: boolean
}
