import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { RecurringTransaction } from 'src/entities/RecurringTransaction.entity';
import { Transaction } from 'src/entities/Transaction.entity';

@Injectable()
export class RecurringProcessorService {
  private readonly logger = new Logger(RecurringProcessorService.name);

  constructor(
    @InjectRepository(RecurringTransaction)
    private recurringRepository: Repository<RecurringTransaction>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Cron runs every day at 0:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRecurringTransactions() {
    this.logger.log('Checking recurring transactions...');

    const now = new Date();

    // Get active recurring list
    const recurringList = await this.recurringRepository.find({
      relations: ['transaction'],
      where: {
            start_date: LessThanOrEqual(now),
        },
    });

    for (const recurring of recurringList) {
      try {
        // If there is an end_date and it is expired, ignore it.
        if (recurring.end_date && now > recurring.end_date) continue;

        const shouldCreate = this.shouldCreateTransaction(recurring, now);
        
        if (shouldCreate) {
          const baseTransaction = recurring.transaction;

          const newTransaction = this.transactionRepository.create({
            category_id: baseTransaction.category_id,
            currency_id: baseTransaction.currency_id,
            user_id: baseTransaction.user_id,
            amount: baseTransaction.amount,
            transaction_type: baseTransaction.transaction_type,
            date: now,
            description: `[Recurring] ${baseTransaction.description || ''}`,
            is_recurring: true,
          });

          await this.transactionRepository.save(newTransaction);
          recurring.last_created_at = now;

          await this.recurringRepository.save(recurring);
          this.logger.log(
            `Created recurring transaction for user ${baseTransaction.user_id}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to process recurring transaction id=${recurring.id}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  /**
   * Check if there is any new creation today
   */
  private shouldCreateTransaction(
    recurring: RecurringTransaction,
    now: Date,
  ): boolean {
    
    if (!recurring.transaction || !recurring.transaction.date) {
        return false;
    }
    const start = new Date(recurring.transaction.date);
    
    if (
        recurring.last_created_at &&
        new Date(recurring.last_created_at).toDateString() === now.toDateString()
    ) {
        return false;
    }

    switch (recurring.recurrence_pattern) {
      case 0: // daily
        return true;
      case 1: // weekly
        return now.getDay() === start.getDay();
      case 2: // monthly
        return now.getDate() === start.getDate();
      case 3: // yearly
        return (
          now.getDate() === start.getDate() &&
          now.getMonth() === start.getMonth()
        );
      default:
        return false;
    }
  }
}
