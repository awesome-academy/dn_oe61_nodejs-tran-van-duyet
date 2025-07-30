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
import { CategoryUser } from './CategoryUser.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({
    type: 'int',
    nullable: false,
    comment: `'0': expense, '1': income`,
  })
  type: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  created_by: number;

  @Column({ type: 'int' })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Optional: Quan hệ với bảng Users (nếu bạn muốn truy xuất User object)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;

  @OneToMany(() => CategoryUser, (cu) => cu.category)
  categoryUsers: CategoryUser[];

}
