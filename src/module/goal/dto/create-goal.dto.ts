import { IsInt, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNumber()
  target_amount: number;

  @IsDateString()
  target_date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  updated_by?: number;

  @IsOptional()
  @IsInt()
  created_by?: number;
}
