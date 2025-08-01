import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  type: number;

  @IsString()
  description: string;

  @IsNotEmpty()
  created_by: number;
}
