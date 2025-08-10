import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from 'src/entities/Transaction.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/Category.entity';
import { Currency } from 'src/entities/Currency.entity';
import { I18nContext } from 'nestjs-i18n';
import { Budget } from 'src/entities/Budget.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,

    @InjectRepository(Budget)
    private readonly budgetsRepository: Repository<Budget>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, i18n: I18nContext) {
    // Save new transaction
    const transaction = this.transactionsRepository.create(createTransactionDto);
    const savedTransaction = await this.transactionsRepository.save(transaction);

    let status = 'success';
    let message = i18n.t('transaction.create_success');

    // Find budget for category and user
    const budget = await this.budgetsRepository
      .createQueryBuilder('budget')
      .innerJoinAndSelect('budget.budgetUsers', 'bu')
      .innerJoinAndSelect('budget.category', 'category')
      .innerJoinAndSelect('bu.user', 'user')
      .where('budget.category_id = :category_id', { category_id: createTransactionDto.category_id })
      .getOne();
    
    if (budget && budget.budgetUsers.some(bu => bu.user.id === createTransactionDto.user_id)) {
      const user_ids = budget.budgetUsers.map(bu => bu.user.id);
      
      const totalSpentRaw = await this.transactionsRepository
        .createQueryBuilder('t')
        .select('SUM(t.amount)', 'total')
        .where('t.category_id = :category_id', { category_id: budget.category_id })
        .andWhere('t.user_id IN (:...user_ids)', { user_ids: user_ids })
        .andWhere('t.date BETWEEN :start AND :end', {
          start: budget.start_date,
          end: budget.end_date || new Date(),
        })
        .andWhere('t.transaction_type = 0')
        .getRawOne();

      const spent = Number(totalSpentRaw.total) || 0;
      const percent = (spent / Number(budget.limit_amount)) * 100;

      if (percent > 100) {
        status = 'over_budget';
        message = i18n.t('transaction.over_budget')
          .replace('{{category}}', budget.category.name)
          .replace('{{percent}}', percent.toFixed(1));
      } else if (percent > 80) {
        status = 'near_budget';
        message = i18n.t('transaction.near_budget')
          .replace('{{category}}', budget.category.name)
          .replace('{{percent}}', percent.toFixed(1));
      }
    }

    return {
      status, // success | near_budget | over_budget
      message,
      data: savedTransaction
    };
  }

  async findAllByUser(
    page: number,
    limit: number,
    user_id: number,
  ): Promise<[Transaction[], number]> {
    const [result, total] = await this.transactionsRepository.findAndCount({
      where: { user_id: user_id },
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return [result, total];
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto, i18n: I18nContext): Promise<Transaction>  {
    await this.transactionsRepository.update(id, updateTransactionDto);
    const transaction = await this.transactionsRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new NotFoundException(i18n.t('transaction.transaction_not_found'));
    }
    return transaction;
  }

  async remove(id: number, i18n: I18nContext): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException(i18n.t('transaction.transaction_not_found'));
    }
    await this.transactionsRepository.delete(id);
    return transaction;
  }

  async importFromExcel(data: any[], user_id: number, i18n: I18nContext) {
    const transactions: Transaction[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2;

      try {
        // 1. Check category
        const category = await this.categoryRepository.findOne({
          where: { name: String(row['category']) },
        });
        if (!category) {
          throw new Error(
            i18n.t('transaction.category_not_found').replace('{{category}}', row['category'])
          );
        }

        // 2. Check currency
        const currency = await this.currencyRepository.findOne({
          where: { id: String(row['currency_id']) },
        });
        if (!currency) {
          throw new Error(
            i18n.t('transaction.currency_not_found').replace('{{currency_id}}', row['currency_id'])
          );
        }

        // 4. Validate amount
        if (isNaN(Number(row['amount']))) {
          throw new Error(
            i18n.t('transaction.amount_invalid').replace('{{amount}}', row['amount'])
          );
        }

        // 5. Validate date
        const date = new Date(row['date']);
        if (isNaN(date.getTime())) {
          throw new Error(
            i18n.t('transaction.date_invalid').replace('{{date}}', row['date'])
          );
        }

        // 6. create transaction
        const transaction = new Transaction();
        transaction.category_id = category.id;
        transaction.currency_id = currency.id;
        transaction.user_id = user_id;
        transaction.amount = Number(row['amount']);
        transaction.transaction_type = Number(row['transaction_type']);
        transaction.date = date;
        transaction.description = row['description'] || null;
        transaction.is_recurring = Boolean(row['is_recurring']);

        transactions.push(transaction);
      } catch (error) {
        errors.push(
          i18n.t('transaction.import_row_error')
          .replace('{{row}}', String(rowNumber))
          .replace('{{message}}', error.message));
      }
    }

    // If there is an error, report all errors.
    if (errors.length > 0) {
      throw new BadRequestException({
        message: i18n.t('transaction.import_failed'),
        errors
      });
    }
    await this.transactionsRepository.save(transactions);

    const categoryIds = Array.from(new Set(transactions.map(tr => tr.category_id)));
    for (const category_id of categoryIds) {
      // Tìm budget có category_id và có user import
      const budget = await this.budgetsRepository
        .createQueryBuilder('budget')
        .innerJoinAndSelect('budget.budgetUsers', 'bu')
        .innerJoinAndSelect('budget.category', 'category')
        .innerJoinAndSelect('bu.user', 'user')
        .where('budget.category_id = :category_id', { category_id })
        .getOne();

      if (budget) {
        const user_ids = budget.budgetUsers.map(bu => bu.user.id);

        const totalSpentRaw = await this.transactionsRepository
          .createQueryBuilder('t')
          .select('SUM(t.amount)', 'total')
          .where('t.category_id = :category_id', { category_id: budget.category_id })
          .andWhere('t.user_id IN (:...user_ids)', { user_ids })
          .andWhere('t.date BETWEEN :start AND :end', {
            start: budget.start_date,
            end: budget.end_date || new Date(),
          })
          .andWhere('t.transaction_type = 0')
          .getRawOne();
        
        const spent = Number(totalSpentRaw.total) || 0;
        const percent = (spent / Number(budget.limit_amount)) * 100;

        if (percent > 100) {
          warnings.push(
            i18n.t('transaction.over_budget')
              .replace('{{category}}', budget.category.name)
              .replace('{{percent}}', percent.toFixed(1))
          );
        } else if (percent > 80) {
          warnings.push(
            i18n.t('transaction.near_budget')
              .replace('{{category}}', budget.category.name)
              .replace('{{percent}}', percent.toFixed(1))
          );
        }
      }
    }
    return {
      message: i18n.t('transaction.import_success').replace('{{count}}', String(transactions.length)),
      count: transactions.length,
      warnings 
    };
  }
}
