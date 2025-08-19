import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/Post.entity';

export class PostListResponseDto {
  @ApiProperty({ type: [Post] })
  post: Post[];

  @ApiProperty({ example: 1, description: 'Trang hiện tại' })
  currentPage: number;

  @ApiProperty({ example: 5, description: 'Tổng số trang' })
  totalPages: number;

  @ApiProperty({ example: 10, description: 'Số lượng mục trên mỗi trang' })
  limit: number;
}
