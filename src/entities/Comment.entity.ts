import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './Post.entity';
import { User } from './User.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'comments' })
export class Comment {
  @ApiProperty({ example: 1, description: 'ID của bình luận' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ApiProperty({ type: () => User, description: 'Người bình luận' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ example: 'Bài viết rất hay!', description: 'Nội dung bình luận' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updated_at: Date;
}
