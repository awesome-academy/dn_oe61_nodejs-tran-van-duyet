import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetUser } from 'src/entities/BudgetUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetUserService {
  constructor(
    @InjectRepository(BudgetUser)
    private readonly budgetUsersRepository: Repository<BudgetUser>,
  ) {}

  async create(budget_id: number, user_id: number) {
    const exists = await this.budgetUsersRepository.findOne({
      where: {
        budget: { id: budget_id },
        user: { id: user_id },
      },
    });

    if (exists) {
      return false;
    }

    const budget_user = await this.budgetUsersRepository.create({
      budget: { id: budget_id },
      user: { id: user_id },
    });
    return this.budgetUsersRepository.save(budget_user);
  }

  async remove(budget_id: number, user_id: number) {
    const budget_user = await this.budgetUsersRepository.findOneBy({
      budget: { id: budget_id },
      user: { id: user_id },
    });
    if (!budget_user) {
      return null;
    }
    await this.budgetUsersRepository.delete(budget_user.id);
    return budget_user;
  }
}
