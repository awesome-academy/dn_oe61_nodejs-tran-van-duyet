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

@Entity({ name: 'budgets' })
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  limit_amount: number;

  @Column({ type: 'int', comment: '0: weekly, 1: monthly, etc.' })
  period: number;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @Column({ type: 'int' })
  created_by: number;

  @Column({ type: 'int', nullable: true })
  updated_by: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => BudgetUser, (bu) => bu.budget)
  budgetUsers: BudgetUser[];

}
