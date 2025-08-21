import { IsInt, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @ApiProperty({ description: "ID của danh mục", example: 1 })
  @IsInt()
  category_id: number;

  @ApiProperty({ description: "Số tiền giới hạn", example: 5000000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  limit_amount: number;

  @ApiProperty({ description: "Chu kỳ (0: tuần, 1: tháng)", example: 1 })
  @IsInt()
  period: number; // 0: weekly, 1: monthly, etc.

  @ApiProperty({ description: "Ngày bắt đầu", example: "2025-08-01" })
  @IsDateString()
  start_date: Date;

  @ApiProperty({ description: "Ngày kết thúc", example: "2025-08-31", required: false })
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
