import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { User } from './User.entity';
import { Currency } from './Currency.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'transactions' })
export class Transaction {
  @ApiProperty({ example: 1, description: 'ID của giao dịch' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID của danh mục' })
  @Column({ type: 'int' })
  category_id: number;

  @ApiProperty({ type: () => Category, description: 'Thông tin danh mục' })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({ example: 'VND', description: 'ID của đơn vị tiền tệ' })
  @Column({ type: 'varchar', length: 10 })
  currency_id: string;

  @ApiProperty({ type: () => Currency, description: 'Thông tin tiền tệ' })
  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ApiProperty({ example: 1, description: 'ID của người dùng' })
  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ example: 50000, description: 'Số tiền giao dịch' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  amount: number;

  @ApiProperty({ example: 0, description: 'Loại giao dịch (0: chi tiêu, 1: thu nhập)' })
  @Column({ type: 'int', comment: '0: expense, 1: income' })
  transaction_type: number;

  @ApiProperty({ example: '2025-08-21T10:00:00.000Z', description: 'Ngày giao dịch' })
  @Column({ type: 'timestamp', nullable: false })
  date: Date;

  @ApiProperty({ example: 'Ăn trưa', description: 'Mô tả giao dịch' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: false, description: 'Có phải giao dịch lặp lại không?' })
  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
