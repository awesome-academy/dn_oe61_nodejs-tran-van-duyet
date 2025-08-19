import { IsInt, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecurringDto {
  @IsOptional()
  @IsInt()
  transaction_id: number;

  @ApiProperty({ description: "Chu kỳ lặp lại (0: daily, 1: weekly, 2: monthly, 3: yearly)", example: 2 })
  @IsIn([0, 1, 2, 3])
  @IsInt()
  recurrence_pattern: number; // 1=weekly, 2=monthly, etc.

  @ApiProperty({ description: "Ngày bắt đầu lặp lại", example: "2025-08-21" })
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: "Ngày kết thúc lặp lại (tùy chọn)", example: "2026-08-21", required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
