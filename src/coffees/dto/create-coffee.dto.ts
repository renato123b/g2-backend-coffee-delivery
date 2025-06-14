
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, MinLength, MaxLength, IsPositive, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
} 