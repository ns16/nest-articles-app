import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContentsTable1687258368000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contents',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true
          },
          {
            name: 'article_id',
            type: 'int',
            isUnique: true
          },
          {
            name: 'body',
            type: 'text'
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: true
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            columnNames: ['article_id'],
            referencedTableName: 'articles',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE'
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contents', true);
  }
}
