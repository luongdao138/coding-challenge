import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class Init1736216682682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'book',
        columns: [
          {
            name: 'id',
            isPrimary: true,
            type: 'varchar',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'author',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'isSoldOut',
            type: 'boolean',
            default: false,
          },
          {
            name: 'publishedAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
      true,
      true,
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('book', true)
  }
}
