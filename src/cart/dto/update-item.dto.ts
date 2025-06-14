import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  quantity: number;
}
