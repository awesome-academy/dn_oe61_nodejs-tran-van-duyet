import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/entities/Comment.entity';

export class CreateCommentResponseDto {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Bình luận bài viết thành công' })
  message: string;
  @ApiProperty({ type: () => Comment })
  data: Comment;
}

export class UpdateCommentResponseDto {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Sửa bình luận thành công' })
  message: string;
  @ApiProperty({ type: () => Comment })
  data: Comment;
}

export class DeleteCommentResponseDto {
  @ApiProperty({ example: true })
  status: boolean;
  @ApiProperty({ example: 'Xoá bình luận thành công' })
  message: string;
  @ApiProperty({ type: () => Comment })
  data: Comment;
}
