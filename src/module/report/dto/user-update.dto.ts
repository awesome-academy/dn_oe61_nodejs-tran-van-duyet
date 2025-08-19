import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userUpdateReportDto {
  @ApiProperty({ description: "Loại (1: feedback, 2: report)", example: 1, required: false })
  @IsInt()
  type: number; // 1 = feedback, 2 = report

  @ApiProperty({ description: "Nội dung cập nhật từ người dùng", example: "Tôi muốn bổ sung thêm thông tin...", required: false })
  @IsString()
  @IsNotEmpty()
  content: string; 
}
