import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Tiêu đề của bài viết',
    example: 'Cách học NestJS hiệu quả',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Nội dung chi tiết của bài viết',
    example: 'Để học NestJS hiệu quả, bạn cần nắm vững TypeScript...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  user_id: number;
}
