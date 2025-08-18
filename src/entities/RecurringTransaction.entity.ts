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

@Entity({ name: 'recurring_transactions' })
export class RecurringTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  transaction_id: number;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({
    type: 'int',
    comment: '0: daily, 1: weekly, 2: monthly, 3: yearly',
  })
  recurrence_pattern: number;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_created_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
