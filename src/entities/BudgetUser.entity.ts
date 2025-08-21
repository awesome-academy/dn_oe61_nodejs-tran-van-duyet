import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Budget } from '../entities/Budget.entity';
import { User } from '../entities/User.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('budget_users') // tên bảng (tùy chọn)
export class BudgetUser {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Budget, (budget) => budget.budgetUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.budgetUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
