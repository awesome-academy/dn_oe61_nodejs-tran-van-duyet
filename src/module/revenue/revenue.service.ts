import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getRevenueGrouped(group: 'month' | 'year' = 'month', start?: string, end?: string) {
    const query = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.plan', 'p')
      .select(
        group === 'month'
          ? "DATE_FORMAT(u.created_at, '%Y-%m')"
          : "DATE_FORMAT(u.created_at, '%Y')",
        'period',
      )
      .addSelect('p.id', 'plan_id')
      .addSelect('p.name', 'plan_name')
      .addSelect('COUNT(u.id)', 'user_count')
      .addSelect('SUM(p.price)', 'revenue')
      .where('u.status = 1');

    if (start) query.andWhere('u.created_at >= :start', { start });
    if (end) query.andWhere('u.created_at <= :end', { end });

    query.groupBy('period, p.id, p.name').orderBy('period', 'ASC');

    return query.getRawMany();
  }
}
