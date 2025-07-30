import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { SystemSetting } from './SystemSetting.entity';
import { Currency } from './Currency.entity';

@Entity({ name: 'supported_currencies' })
export class SupportedCurrency {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SystemSetting)
  @JoinColumn({ name: 'system_id' })
  system: SystemSetting;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ type: 'float', nullable: true })
  exchange_rate: number;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
