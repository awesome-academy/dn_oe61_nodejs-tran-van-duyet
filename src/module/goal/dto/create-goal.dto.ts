import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ description: 'Tên của mục tiêu', example: 'Mua laptop mới' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Số tiền cần đạt được', example: 25000000 })
  @IsNumber()
  target_amount: number;

  @ApiProperty({ description: 'Ngày phải hoàn thành mục tiêu', example: '2025-12-31' })
  @IsDateString()
  target_date: string;

  @ApiProperty({ description: 'Mô tả chi tiết cho mục tiêu', required: false, example: 'Tiết kiệm để mua Macbook Pro M3' })
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
