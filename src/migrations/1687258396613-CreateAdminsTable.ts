import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdminsTable1687258396613 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
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
    await queryRunner.dropTable('admins', true);
  }
}
