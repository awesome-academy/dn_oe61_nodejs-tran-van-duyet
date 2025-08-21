import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreateCommentDto {
  @ApiProperty({ description: 'Nội dung của bình luận', example: 'Thật tuyệt vời!' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  user_id: number;
}
