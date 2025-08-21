import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/entities/Comment.entity';

export class CommentListResponseDto {
  @ApiProperty({ type: [Comment] })
  data: Comment[];
}
