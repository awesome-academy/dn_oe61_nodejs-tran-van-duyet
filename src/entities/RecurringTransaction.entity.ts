import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './Transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'recurring_transactions' })
export class RecurringTransaction {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID của giao dịch gốc' })
  @Column({ type: 'int' })
  transaction_id: number;

  @ApiProperty({ type: () => Transaction, description: 'Thông tin giao dịch gốc' })
  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ApiProperty({ example: 2, description: 'Chu kỳ lặp lại (0: daily, 1: weekly, 2: monthly, 3: yearly)' })
  @Column({
    type: 'int',
    comment: '0: daily, 1: weekly, 2: monthly, 3: yearly',
  })
  recurrence_pattern: number;

  @ApiProperty({ example: '2025-08-01T00:00:00.000Z' })
  @Column({ type: 'timestamp' })
  start_date: Date;

  @ApiProperty({ example: '2026-08-01T00:00:00.000Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  last_created_at: Date | null;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
