import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Goal } from './Goal.entity';
import { User } from './User.entity';

@Entity('goal_users') // hoặc 'goal_user' tùy convention bạn dùng
export class GoalUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Goal, (goal) => goal.goalUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goal_id' })
  goal: Goal;

  @ManyToOne(() => User, (user) => user.goalUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
