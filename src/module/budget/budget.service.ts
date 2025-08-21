import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/entities/Budget.entity';
import { Not, Repository } from 'typeorm';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BudgetUser } from 'src/entities/BudgetUser.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetUser)
    private readonly budgetUsersRepository: Repository<BudgetUser>,
  ) {}

  async create(
    createBudgetDto: CreateBudgetDto,
    @I18n() i18n: I18nContext,
  ): Promise<Budget> {
    const created_by = createBudgetDto.created_by;
    const category_id = createBudgetDto.category_id;

    const existingBudget = await this.budgetRepository.findOne({
      where: {
        created_by,
        category_id,
      },
    });

    if (existingBudget) {
      throw new ConflictException(i18n.t('budget.create_error'));
    }
    const budget = await this.budgetRepository.create(createBudgetDto);

    return await this.budgetRepository.save(budget);
  }

  async findAllByUser(user_id: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [budgets, total] = await this.budgetRepository
      .createQueryBuilder('budget')
      .innerJoin('budget.budgetUsers', 'budgetUser')
      .innerJoinAndSelect('budget.budgetUsers', 'bu')
      .innerJoinAndSelect('bu.user', 'user')
      .where('budgetUser.user_id = :user_id', { user_id })
      .select([
        'budget.id',
        'budget.limit_amount',
        'budget.period',
        'budget.start_date',
        'budget.end_date',

        'bu.id',
        'user.id',
        'user.email',
        'user.name',
        'user.avatar',
      ])
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: budgets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBudgetDetail(
    id: number,
    @I18n() i18n: I18nContext,
  ): Promise<Budget> {
    const budget = await this.budgetRepository
      .createQueryBuilder('budget')
      .leftJoinAndSelect('budget.category', 'category')
      .leftJoinAndSelect('budget.createdByUser', 'createdByUser')
      .leftJoinAndSelect('budget.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('budget.budgetUsers', 'bu')
      .leftJoinAndSelect('bu.user', 'user')
      .select([
        'budget.id',
        'budget.limit_amount',
        'budget.period',
        'budget.start_date',
        'budget.end_date',
        'category.name',
        'createdByUser.id',
        'createdByUser.name',
        'createdByUser.avatar',
        'updatedByUser.id',
        'updatedByUser.name',
        'updatedByUser.avatar',
        'bu.id',
        'user.id',
        'user.email',
        'user.name',
        'user.avatar',
      ])
      .where('budget.id = :id', { id })
      .getOne();

    if (!budget) {
      throw new NotFoundException(i18n.t('budget.budget_not_found'));
    }

    return budget;
  }

  async update(
    id: number,
    updateBudgetDto: UpdateBudgetDto,
    @I18n() i18n: I18nContext,
  ) {
    const user_budget = await this.budgetUsersRepository.findOne({where: {
      user: { id: updateBudgetDto.updated_by },
      budget: { id },
    }})
    console.log(user_budget);
    
    if (!user_budget) {
      throw new NotFoundException(i18n.t('budget.not_update'));
    }

    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException(i18n.t('budget.budget_not_found'));
    }

    const existing = await this.budgetRepository
      .createQueryBuilder('budget')
      .innerJoin('budget.budgetUsers', 'bu')
      .where('budget.category_id = :categoryId', {
        categoryId: updateBudgetDto.category_id,
      })
      .andWhere('budget.id != :id', { id })
      .andWhere('bu.user_id = :userId', { userId: updateBudgetDto.updated_by })
      .getOne();

    if (existing) {
      throw new ConflictException(i18n.t('budget.update_error'));
    }

    const result = await this.budgetRepository.update(id, updateBudgetDto);

    if (result.affected === 0) {
      throw new BadRequestException(i18n.t('budget.update_failed'));
    }

    return await this.budgetRepository.findOne({ where: { id } });
  }

  async isUserCreator(user_id: number, budget_id: number): Promise<boolean> {
    return !!(await this.budgetRepository.findOne({
      where: { id: budget_id, created_by: user_id },
    }));
  }

  async remove(id: number) {
    const budget = this.budgetRepository.findOneBy({ id });
    await this.budgetRepository.delete(id);
    return budget;
  }
}
