import { Injectable } from '@nestjs/common';
import { CreateRevenueDto } from './dto/create-revenue.dto';
import { UpdateRevenueDto } from './dto/update-revenue.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // async getPlanRevenue(startDate?: string, endDate?: string) {
  //   const query = this.userRepository
  //     .createQueryBuilder('u')
  //     .select('p.name', 'plan_name')
  //     .addSelect('COUNT(u.id)', 'user_count')
  //     .addSelect('SUM(p.price)', 'revenue')
  //     .innerJoin('u.plan', 'p')
  //     .where('u.status = :active', { active: 1 });

  //   if (startDate && endDate) {
  //     query.andWhere('u.created_at BETWEEN :start AND :end', {
  //       start: startDate,
  //       end: endDate,
  //     });
  //   }

  //   query.groupBy('p.name');

  //   return query.getRawMany();
  // }
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
      .addSelect('p.name', 'plan_name')
      .addSelect('COUNT(u.id)', 'user_count')
      .addSelect('SUM(p.price)', 'revenue')
      .where('u.status = 1');

    if (start) query.andWhere('u.created_at >= :start', { start });
    if (end) query.andWhere('u.created_at <= :end', { end });

    query.groupBy('period, p.name').orderBy('period', 'ASC');

    return query.getRawMany();
  }
}
