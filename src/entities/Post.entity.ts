import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'posts' })
export class Post {
  @ApiProperty({ example: 1, description: 'ID của bài viết' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Tiêu đề bài viết', description: 'Tiêu đề' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'Nội dung bài viết...', description: 'Nội dung' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ type: () => User, description: 'Thông tin người đăng bài' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updated_at: Date;
}
