import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryUserPlan } from 'src/entities/HistoryUserPlan.entity';
import { User } from 'src/entities/User.entity';
import { Plan } from 'src/entities/Plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RevenueService {
  private readonly logger = new Logger(RevenueService.name);
  constructor(
    @InjectRepository(HistoryUserPlan)
    private historyUserPlanRepository: Repository<HistoryUserPlan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async getRevenueGrouped(
    group: 'month' | 'year' = 'month',
    start?: string,
    end?: string,
  ) {
    try {
      const query = this.historyUserPlanRepository
        .createQueryBuilder('up')
        .innerJoin('up.user', 'u')
        .innerJoin('up.plan', 'p')
        .select(
          group === 'month'
            ? "DATE_FORMAT(up.start_date, '%Y-%m')"
            : "DATE_FORMAT(up.start_date, '%Y')",
          'period',
        )
        .addSelect('p.id', 'plan_id')
        .addSelect('p.name', 'plan_name')
        .addSelect('COUNT(up.id)', 'user_count')
        .addSelect('SUM(p.price)', 'revenue');

      if (start) {
        query.andWhere('up.start_date >= :start', { start });
      }
      if (end) {
        query.andWhere('up.start_date <= :end', { end });
      }
      query.groupBy('period, p.id, p.name').orderBy('period', 'ASC');
      const revenueData = await query.getRawMany();

      const freePlan = await this.planRepository.findOne({
        where: { name: 'Free' },
      });
      const premiumPlan = await this.planRepository.findOne({
        where: { name: 'Premium' },
      });

      const totalFree = freePlan
        ? await this.userRepository.count({ where: { plan_id: freePlan.id } })
        : 0;
      const totalPremium = premiumPlan
        ? await this.userRepository.count({
            where: { plan_id: premiumPlan.id },
          })
        : 0;

      return {
        revenueData,
        totalFree,
        totalPremium,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get revenue data. Filters: ${JSON.stringify({ group, start, end })}`,
        error.stack,
      );
      throw new InternalServerErrorException('Could not fetch revenue data.');
    }
  }
}
