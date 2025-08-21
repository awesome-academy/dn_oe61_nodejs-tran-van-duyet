import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'plans' })
export class Plan {
  @ApiProperty({ example: 1, description: 'ID của gói' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Gói Cơ Bản', description: 'Tên của gói' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @ApiProperty({ example: 99000, description: 'Giá của gói (VND)' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ example: 'Gói phù hợp cho người dùng cá nhân.', description: 'Mô tả chi tiết về gói' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ 
    example: ['Tính năng A', 'Tính năng B'], 
    description: 'Danh sách các tính năng của gói',
    type: [String] 
  })
  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updated_at: Date;
}
