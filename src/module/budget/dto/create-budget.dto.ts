import { IsInt, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsInt()
  category_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  limit_amount: number;

  @IsInt()
  period: number; // 0: weekly, 1: monthly, etc.

  @IsDateString()
  start_date: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @IsOptional()
  @IsInt()
  created_by?: number;

  @IsOptional()
  @IsInt()
  updated_by?: number;
}
