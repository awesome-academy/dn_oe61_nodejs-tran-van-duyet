import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Category } from './Category.entity';
import { BudgetUser } from './BudgetUser.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'budgets' })
export class Budget {
  @ApiProperty({ example: 1, description: 'ID của ngân sách' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID của danh mục' })
  @Column({ type: 'int' })
  category_id: number;

  @ApiProperty({ type: () => Category, description: 'Thông tin danh mục' })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({ example: 5000000, description: 'Số tiền giới hạn' })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  limit_amount: number;

  @ApiProperty({ example: 1, description: 'Chu kỳ (0: tuần, 1: tháng,...)' })
  @Column({ type: 'int', comment: '0: weekly, 1: monthly, etc.' })
  period: number;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z', description: 'Ngày bắt đầu' })
  @Column({ type: 'timestamp' })
  start_date: Date;

  @ApiProperty({ example: '2025-08-31T00:00:00.000Z', description: 'Ngày kết thúc' })
  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'int', nullable: true })
  created_by: number;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @ApiProperty({ type: () => User, description: 'Người tạo' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ApiProperty({ type: () => User, description: 'Người cập nhật cuối' })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ type: () => [BudgetUser], description: 'Danh sách người dùng chung ngân sách' })
  @OneToMany(() => BudgetUser, (bu) => bu.budget)
  budgetUsers: BudgetUser[];

}
