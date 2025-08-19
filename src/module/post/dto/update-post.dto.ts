import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Tiêu đề mới của bài viết',
    example: 'Cập nhật tiêu đề',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Nội dung mới của bài viết',
    example: 'Cập nhật nội dung...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;
}
