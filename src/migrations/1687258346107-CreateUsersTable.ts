import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1687258346107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            isUnique: true
          },
          {
            name: 'password',
            type: 'char',
            length: '60'
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isUnique: true
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
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
