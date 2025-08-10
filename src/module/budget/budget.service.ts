import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from 'src/entities/Budget.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>
  ){}

  async create(createBudgetDto: CreateBudgetDto) {
    const created_by = createBudgetDto.created_by;
    const category_id = createBudgetDto.category_id;
    
    const check_budget = await this.budgetRepository.findOne({ 
      where: { 
        created_by,
        category_id,
      },
    })
    
    if(check_budget){
      return false;
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

  async findOne(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: [
        'category',
        'createdByUser',
        'updatedByUser',
        'budgetUsers',
        'budgetUsers.user',
      ],
    });

    if (!budget) {
      throw new NotFoundException(`Budget with id ${id} not found`);
    }
    if (budget.createdByUser) {
      budget.createdByUser = {
        id: budget.createdByUser.id,
        name: budget.createdByUser.name,
        avatar: budget.createdByUser.avatar,
      } as any;
    }

    if (budget.updatedByUser) {
      budget.updatedByUser = {
        id: budget.updatedByUser.id,
        name: budget.updatedByUser.name,
        avatar: budget.updatedByUser.avatar,
      } as any;
    }

    budget.budgetUsers.forEach(bu => {
      if (bu.user) {
        bu.user = {
          id: bu.user.id,
          name: bu.user.name,
          avatar: bu.user.avatar,
        } as any;
      }
    });

    return budget;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Budget with id ${id} not found`);
    }
    
    const existing = await this.budgetRepository.findOne({
      where: {
        category_id: updateBudgetDto.category_id,
        id: Not(id),
      },
    });
    
    if (existing) {
      return false;
    }

    await this.budgetRepository.update(id, updateBudgetDto)
    return this.budgetRepository.findOne({ where: { id } });
  }

  async isUserCreator(user_id: number, budget_id: number): Promise<boolean> {
    return !!(await this.budgetRepository.findOne({
      where: { id: budget_id, created_by: user_id },
    }));
  }


  async remove(id: number) {
    const budget = this.budgetRepository.findOneBy({id});
    await this.budgetRepository.delete(id);
    return budget;
  }
}
