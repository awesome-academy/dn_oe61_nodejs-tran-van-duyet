import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'feedback_reports' })
export class FeedbackReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', comment: '1 = feedback, 2 = report' })
  type: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0, comment: '0 = pending, 1 = resolved' })
  status: number;

  @Column({ type: 'text', nullable: true })
  response: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
