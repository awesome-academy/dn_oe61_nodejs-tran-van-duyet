import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BudgetUser } from 'src/entities/BudgetUser.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetUserService {
  constructor(
    @InjectRepository(BudgetUser)
    private readonly budgetUsersRepository: Repository<BudgetUser>,
  ) {}

  async create(budget_id: number, user_id: number, @I18n() i18n: I18nContext): Promise<BudgetUser> {
    const exists = await this.budgetUsersRepository.findOne({
      where: {
        budget: { id: budget_id },
        user: { id: user_id },
      },
    });

    if (exists) {
      throw new NotFoundException(i18n.t('budget.add_error'));
    }

    const budget_user = await this.budgetUsersRepository.create({
      budget: { id: budget_id },
      user: { id: user_id },
    });
    return this.budgetUsersRepository.save(budget_user);
  }

  async remove(budget_id: number, user_id: number, @I18n() i18n: I18nContext): Promise<BudgetUser> {
    const budget_user = await this.budgetUsersRepository.findOneBy({
      budget: { id: budget_id },
      user: { id: user_id },
    });
    if (!budget_user) {
      throw new NotFoundException(i18n.t('budget.budget_user_not_found'));
    }
    await this.budgetUsersRepository.delete(budget_user.id);
    return budget_user;
  }
}
