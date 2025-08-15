import { IsInt, IsString, IsNumber, IsDateString, IsOptional, IsBoolean, MaxLength, IsPositive, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  category_id: number;

  @IsString()
  currency_id: string;

  @IsOptional()
  user_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(0)
  @Max(1)
  transaction_type: number; // 0: expense, 1: income

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;
}
