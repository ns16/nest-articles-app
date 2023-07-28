import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({ type: 'integer', minimum: 1 }) page: number;

  @ApiProperty({ type: 'integer', minimum: 1 }) pageSize: number;

  @ApiProperty({ type: 'integer', minimum: 0 }) rowCount: number;

  @ApiProperty({ type: 'integer', minimum: 0 }) pageCount: number;
}
