import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from 'src/entities/Goal.entity';
import { Not, Repository } from 'typeorm';
import { I18n, I18nContext } from 'nestjs-i18n';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create(createGoalDto);
    return await this.goalRepository.save(goal);
  }

  async findAllByUser(user_id: number): Promise<Goal[]>  {
    const goals = await this.goalRepository
      .createQueryBuilder('goal')
      .innerJoin('goal.goalUsers', 'guFilter', 'guFilter.user_id = :user_id', { user_id }) 
      .leftJoinAndSelect('goal.goalUsers', 'gu')
      .leftJoinAndSelect('gu.user', 'user')
      .select([
        'goal.id',
        'goal.name',
        'goal.target_amount',
        'goal.target_date',
        'goal.description',
        'goal.created_at',
        'goal.updated_at',

        'gu.id',
        'user.id',
        'user.name',
        'user.avatar',
      ])
      .getMany();

    return goals;
  }

  async findOne(id: number, message: string): Promise<Goal> {
    const goal = await this.goalRepository
      .createQueryBuilder('goal')
      .leftJoinAndSelect('goal.createdByUser', 'createdByUser')
      .leftJoinAndSelect('goal.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('goal.goalUsers', 'gu')
      .leftJoinAndSelect('gu.user', 'user')
      .select([
        'goal.id',
        'goal.name',
        'goal.target_amount',
        'goal.target_date',
        'goal.description',
        'createdByUser.id',
        'createdByUser.name',
        'createdByUser.avatar',
        'updatedByUser.id',
        'updatedByUser.name',
        'updatedByUser.avatar',
        'gu.id',
        'user.id',
        'user.name',
        'user.avatar',
      ])
      .where('goal.id = :id', { id })
      .getOne();

    if (!goal) {
      throw new NotFoundException(message);
    }

    return goal;
  }

  async update(id: number, updateGoalDto: UpdateGoalDto, @I18n() i18n: I18nContext): Promise<Goal | null>  {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(i18n.t('goal.goal_not_found'));
    }

    const existing = await this.goalRepository.findOne({
      where: {
        name: updateGoalDto.name,
        id: Not(id),
      },
    });

    if (existing) {
      throw new ConflictException(i18n.t('goal.update_error'));
    }

    await this.goalRepository.update(id, updateGoalDto);
    return await this.goalRepository.findOne({ where: { id } });
  }

  async isUserCreator(user_id: number, goal_id: number): Promise<boolean> {
    return !!(await this.goalRepository.findOne({
      where: { id: goal_id, created_by: user_id },
    }));
  }

  async remove(id: number, message: string): Promise<Goal> {
    const goal = await this.goalRepository.findOneBy({ id });
    if (!goal) {
      throw new NotFoundException(message);
    }
    await this.goalRepository.delete(id);
    return goal;
  }
}
