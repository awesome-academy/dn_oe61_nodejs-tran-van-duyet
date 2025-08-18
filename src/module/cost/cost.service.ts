import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as dayjs from 'dayjs'; // Use dayjs for easier date manipulation

@Injectable()
export class CostService {
  private readonly logger = new Logger(CostService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async getTransactionsSummary(
    userId: number,
    filters: {
      date?: string;
      month?: number;
      year?: number;
      categoryId?: number;
    } = {}, // Assign a default value to avoid errors
  ) {
    try {
      const qb = this.transactionRepo
        .createQueryBuilder('t')
        .where('t.user_id = :userId', { userId });

      // Optimization: Build the query dynamically, without if/else branching
      this.applyDateFilters(qb, filters);

      if (filters.categoryId) {
        qb.andWhere('t.category_id = :categoryId', { categoryId: filters.categoryId });
      }

      // Group by category and calculate totals
      qb.leftJoin('t.category', 'c')
        .select('c.id', 'category_id')
        .addSelect('c.name', 'category_name')
        .addSelect(`SUM(CASE WHEN t.transaction_type = 0 THEN t.amount ELSE 0 END)`, 'total_expense')
        .addSelect(`SUM(CASE WHEN t.transaction_type = 1 THEN t.amount ELSE 0 END)`, 'total_income')
        .groupBy('c.id, c.name')
        .orderBy('total_expense', 'DESC');
      
      const summaryByCategory = await qb.getRawMany();

      // If filtering only by year, add monthly statistics
      if (filters.year && !filters.month && !filters.date) {
        const monthlySummary = await this.getMonthlySummary(userId, filters.year);
        return { byCategory: summaryByCategory, byMonth: monthlySummary };
      }

      return { byCategory: summaryByCategory };

    } catch (error) {
      this.logger.error(`Failed to get transaction summary for user ${userId}`, error.stack);
      throw new InternalServerErrorException('Could not retrieve transaction summary.');
    }
  }

  /**
   * Helper to get monthly statistics for a specific year.
   */
  private async getMonthlySummary(userId: number, year: number) {
    const qb = this.transactionRepo
      .createQueryBuilder('t')
      .where('t.user_id = :userId', { userId })
      .select('MONTH(t.date)', 'month')
      .addSelect(`SUM(CASE WHEN t.transaction_type = 0 THEN t.amount ELSE 0 END)`, 'total_expense')
      .addSelect(`SUM(CASE WHEN t.transaction_type = 1 THEN t.amount ELSE 0 END)`, 'total_income');
    
    this.applyDateFilters(qb, { year }); // Apply the efficient year filter

    return qb.groupBy('month').orderBy('month', 'ASC').getRawMany();
  }

  /**
   * Optimization: Helper to apply date filters efficiently.
   */
  private applyDateFilters(
    qb: SelectQueryBuilder<Transaction>,
    filters: { date?: string; month?: number; year?: number },
  ) {
    if (filters.date) {
      // Filter exactly by date
      const startOfDay = dayjs(filters.date).startOf('day').toDate();
      const endOfDay = dayjs(filters.date).endOf('day').toDate();
      qb.andWhere('t.date BETWEEN :start AND :end', { start: startOfDay, end: endOfDay });
    } else if (filters.year && filters.month) {
      // Filter by year and month
      const startOfMonth = dayjs(`${filters.year}-${filters.month}-01`).startOf('month').toDate();
      const endOfMonth = dayjs(startOfMonth).endOf('month').toDate();
      qb.andWhere('t.date BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth });
    } else if (filters.year) {
      // Filter by year
      const startOfYear = dayjs(`${filters.year}-01-01`).startOf('year').toDate();
      const endOfYear = dayjs(startOfYear).endOf('year').toDate();
      qb.andWhere('t.date BETWEEN :start AND :end', { start: startOfYear, end: endOfYear });
    }
  }
}
