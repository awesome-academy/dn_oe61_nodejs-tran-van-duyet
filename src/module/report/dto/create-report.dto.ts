import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ description: "Loại (0: feedback, 1: report)", example: 1 })
  @IsInt()
  type: number; // 1 = feedback, 2 = report

  @ApiProperty({ description: "Nội dung feedback/report", example: "Giao diện khó sử dụng." })
  @IsString()
  @IsNotEmpty()
  content: string; 

  @IsOptional()
  user_id: number;
}
