import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/Post.entity';
import { User } from 'src/entities/User.entity';

export class SinglePostResponseDto {
  @ApiProperty({ example: 'Tạo bài viết thành công' })
  message: string;

  @ApiProperty({ type: () => Post })
  data: Post;
}
class UpdatePostDataDto {
  @ApiProperty({ example: 103 })
  id: number;

  @ApiProperty({ example: 'Cập nhật tiêu đề' })
  title: string;

  @ApiProperty({ example: 'Cập nhật nội dung...' })
  content: string;

  @ApiProperty({ example: '2025-08-20T15:36:29.945Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-08-20T15:40:27.000Z' })
  updated_at: Date;
}

export class UpdatePostResponseDto {
  @ApiProperty({ example: 'Cập nhật bài viết thành công' })
  message: string;

  @ApiProperty({ type: () => UpdatePostDataDto })
  data: UpdatePostDataDto;
}

class LikePostUserDto {
    @ApiProperty({ example: 15 })
    id: number;
}

class LikePostPostDto {
    @ApiProperty({ example: 97 })
    id: number;
}

class LikePostDataDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ type: () => User })
  user: LikePostUserDto;

  @ApiProperty({ type: () => Post })
  post: LikePostPostDto;

  @ApiProperty({ example: '2025-08-20T15:48:31.568Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-08-20T15:48:31.568Z' })
  updated_at: Date;
}

export class LikePostResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'Thích/bỏ thích bài viết thành công' })
  message: string;

  @ApiProperty({ type: () => LikePostDataDto })
  data: LikePostDataDto;
}
