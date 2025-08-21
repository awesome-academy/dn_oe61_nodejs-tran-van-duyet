import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { GoalUser } from './GoalUser.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'goals' })
export class Goal {
  @ApiProperty({ example: 1, description: 'ID của mục tiêu' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Học lập trình NestJS', description: 'Tên mục tiêu' })
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ example: 5000000, description: 'Số tiền mục tiêu' })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  target_amount: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', description: 'Ngày hoàn thành mục tiêu' })
  @Column({ type: 'timestamp' })
  target_date: Date;

  @ApiProperty({ example: 'Cần tiết kiệm tiền để mua laptop mới', description: 'Mô tả chi tiết' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 1, description: 'ID người tạo' })
  @Column({ type: 'int', nullable: true })
  created_by: number;

  @ApiProperty({ example: 1, description: 'ID người cập nhật' })
  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @ApiProperty({ type: () => User, description: 'Người tạo mục tiêu' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @ApiProperty({ type: () => User, description: 'Người cập nhật mục tiêu gần nhất' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ApiProperty({ description: 'Thời gian tạo' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Thời gian cập nhật' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [GoalUser], description: 'Danh sách người dùng tham gia mục tiêu' })
  @OneToMany(() => GoalUser, (gu) => gu.goal)
  goalUsers: GoalUser[];
}
