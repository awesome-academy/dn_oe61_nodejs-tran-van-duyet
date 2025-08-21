import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Notification } from './Notification.entity';
import { Role } from './Role.entity';
import { BudgetUser } from './BudgetUser.entity';
import { CategoryUser } from './CategoryUser.entity';
import { GoalUser } from './GoalUser.entity';
import { Plan } from './Plan.entity'; 
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email người dùng' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  encrypted_password: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người dùng' })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL ảnh đại diện' })
  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', nullable: true })
  registration_token: string | null;

  @Column({ type: 'varchar', nullable: true })
  password_token: string;

  @Column({ type: 'int', default: 1 }) // ví dụ: 1 = active, 0 = deactive
  status: number;

  @Column({ type: 'int', default: 1  })
  plan_id: number;

  @Column({ type: 'int', default: 1  })
  role_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
  // user.entity.ts

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => BudgetUser, (bu) => bu.user)
  budgetUsers: BudgetUser[];

  @OneToMany(() => CategoryUser, (cu) => cu.user)
  categoryUsers: CategoryUser[];

  @OneToMany(() => GoalUser, (gu) => gu.user)
  goalUsers: GoalUser[];

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
