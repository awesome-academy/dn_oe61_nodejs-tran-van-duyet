import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsDateString, IsOptional, IsBoolean, MaxLength, IsPositive, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: "ID của danh mục", example: 1 })
  @IsInt()
  category_id: number;

  @ApiProperty({ description: "ID của đơn vị tiền tệ", example: "VND" })
  @IsString()
  currency_id: string;

  @IsOptional()
  user_id: number;

  @ApiProperty({ description: "Số tiền giao dịch", example: 50000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ description: "Loại giao dịch (0: chi tiêu, 1: thu nhập)", example: 0 })
  @IsInt()
  @Min(0)
  @Max(1)
  transaction_type: number;

  @ApiProperty({ description: "Ngày giao dịch", example: "2025-08-21" })
  @IsDateString()
  date: Date;

  @ApiProperty({ description: "Mô tả", example: "Ăn trưa với bạn bè", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Giao dịch lặp lại?", example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_recurring?: boolean;
}
