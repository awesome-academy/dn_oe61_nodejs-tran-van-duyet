import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'currencies' })
export class Currency {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  id: string; // e.g., 'USD', 'VND', 'EUR'

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  symbol: string;

  @Column({ type: 'decimal', precision: 15, scale: 6, default: 1.0 })
  exchange_rate: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
