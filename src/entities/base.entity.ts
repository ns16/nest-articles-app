import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @ApiProperty({
    type: 'integer',
    minimum: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
