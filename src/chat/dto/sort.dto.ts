import { IsOptional } from 'class-validator';

export class SortDto {
  @IsOptional()
  page: number;

  @IsOptional()
  sortBy: string;

  @IsOptional()
  sortOrder: 'ASC' | 'DESC';
}
