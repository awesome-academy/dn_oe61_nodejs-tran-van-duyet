import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext } from 'nestjs-i18n';
import { GoalUser } from 'src/entities/GoalUser.entity';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoalUserService {
  constructor(
    @InjectRepository(GoalUser)
    private readonly goalUserRepository: Repository<GoalUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    goal_id: number,
    user_id: number,
    i18n: I18nContext,
  ): Promise<GoalUser | null> {
    const user_exit = this.userRepository.findOne({ where: {id: user_id}});
    if (!user_exit) {
      throw new NotFoundException(i18n.t('user.user_not_found'));
    }
    const exists = await this.goalUserRepository.findOne({
      where: {
        goal: { id: goal_id },
        user: { id: user_id },
      },
    });

    if (exists) {
      throw new ConflictException(i18n.t('goal.add_error'));
    }

    const goal_user = await this.goalUserRepository.create({
      goal: { id: goal_id },
      user: { id: user_id },
    });
    const saved = await this.goalUserRepository.save(goal_user);

    return this.goalUserRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
      select: {
        id: true,
        user: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
    });
  }

  async remove(
    goal_id: number,
    user_id: number,
    message: string,
  ): Promise<GoalUser> {
    const goal_user = await this.goalUserRepository.findOneBy({
      goal: { id: goal_id },
      user: { id: user_id },
    });

    if (!goal_user) {
      throw new NotFoundException(message);
    }

    await this.goalUserRepository.delete(goal_user.id);
    return goal_user;
  }
}
