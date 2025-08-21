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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'feedback_reports' })
export class FeedbackReport {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

    @ApiProperty({ example: 1, description: 'ID người gửi' })
  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ example: 1, description: 'Loại (0: feedback, 1: report)' })
  @Column({ type: 'int', comment: '0 = feedback, 1 = report' })
  type: number;

  @ApiProperty({ example: 'Ứng dụng hoạt động chậm.' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: 0, description: 'Trạng thái (0: pending, 1: processing, 2: resolved)' })
  @Column({ type: 'int', default: 0, comment: '0 = pending, 1 = processing, 2=resolved' })
  status: number;

  @ApiProperty({ example: 'Cảm ơn bạn đã góp ý, chúng tôi sẽ cải thiện.', nullable: true })
  @Column({ type: 'text', nullable: true })
  response: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}
