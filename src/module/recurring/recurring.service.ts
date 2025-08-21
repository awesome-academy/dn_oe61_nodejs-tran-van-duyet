import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurringTransaction } from 'src/entities/RecurringTransaction.entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class RecurringService {
  constructor(
    @InjectRepository(RecurringTransaction)
    private readonly recurringRepository: Repository<RecurringTransaction>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async create(
    createRecurringDto: CreateRecurringDto,
    i18n: I18nContext,
  ): Promise<RecurringTransaction | null> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: createRecurringDto.transaction_id },
    });

    if (!transaction) {
      throw new NotFoundException(i18n.t('transaction.transaction_not_found'));
    }

    const recurring = this.recurringRepository.create(createRecurringDto);
    const saved = await this.recurringRepository.save(recurring);

    // Lấy lại kèm quan hệ transaction
    return await this.recurringRepository.findOne({
      where: { id: saved.id },
      relations: ['transaction'],
    });
  }

  async findAllByUser(user_id: number): Promise<RecurringTransaction[]> {
    return await this.recurringRepository
      .createQueryBuilder('recurring')
      .innerJoinAndSelect('recurring.transaction', 'transaction')
      .where('transaction.user_id = :user_id', { user_id })
      .getMany();
  }

  async findByTransaction(
    transaction_id: number,
  ): Promise<RecurringTransaction[]> {
    return await this.recurringRepository.find({
      where: { transaction_id },
      relations: ['transaction'],
    });
  }

  async update(
    id: number,
    updateRecurringDto: UpdateRecurringDto,
    i18n: I18nContext,
  ): Promise<RecurringTransaction | null> {
    const recurring = await this.recurringRepository.findOne({ where: { id } });

    if (!recurring) {
      throw new NotFoundException(i18n.t('recurring.not_found'));
    }

    const result = await this.recurringRepository.update(
      id,
      updateRecurringDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(i18n.t('recurring.update_failed'));
    }

    return await this.recurringRepository.findOne({
      where: { id },
      relations: ['transaction'],
    });
  }

  async remove(id: number, i18n: I18nContext): Promise<RecurringTransaction> {
    const recurring = await this.recurringRepository.findOne({
      where: { id },
      relations: ['transaction'],
    });

    if (!recurring) {
      throw new NotFoundException(i18n.t('recurring.not_found'));
    }

    await this.recurringRepository.remove(recurring);
    return recurring;
  }
}
