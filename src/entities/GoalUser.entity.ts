import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Goal } from './Goal.entity';
import { User } from './User.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('goal_users') // hoặc 'goal_user' tùy convention bạn dùng
export class GoalUser {
  @ApiProperty({ example: 1, description: 'ID của liên kết Goal-User' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Goal, (goal) => goal.goalUsers, { onDelete: 'CASCADE' })
  @ManyToOne(() => Goal, (goal) => goal.goalUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @ApiProperty({ type: () => User, description: 'Thông tin người dùng tham gia' })
  @ManyToOne(() => User, (user) => user.goalUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
