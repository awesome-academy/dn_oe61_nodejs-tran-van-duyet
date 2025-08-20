import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateRecurringDto {
  @IsOptional()
  @IsInt()
  transaction_id: number;

  @IsInt()
  recurrence_pattern: number; // 1=weekly, 2=monthly, etc.

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
