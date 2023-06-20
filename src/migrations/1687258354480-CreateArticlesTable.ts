import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticlesTable1687258354480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'articles',
      columns: [
        {
          name: 'id',
          type: 'int',
          isGenerated: true,
          generationStrategy: 'increment',
          isPrimary: true
        },
        {
          name: 'user_id',
          type: 'int'
        },
        {
          name: 'title',
          type: 'varchar',
          length: '100'
        },
        {
          name: 'description',
          type: 'varchar',
          length: '500'
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['published', 'draft']
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
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles', true);
  }
}
