import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticlesTagsTable1687258386646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'articles_tags',
      columns: [
        {
          name: 'article_id',
          type: 'int',
          isPrimary: true
        },
        {
          name: 'tag_id',
          type: 'int',
          isPrimary: true
        }
      ],
      foreignKeys: [
        {
          columnNames: ['article_id'],
          referencedTableName: 'articles',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        },
        {
          columnNames: ['tag_id'],
          referencedTableName: 'tags',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE'
        }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles_tags', true);
  }
}
