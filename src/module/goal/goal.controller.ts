import { Controller, Get, Post, Body, Delete, UseGuards, Req, BadRequestException, Put } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalUserService } from '../goal-user/goal-user.service';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { addUserGoalDto } from './dto/add-user-goal.dto';

@UseGuards(JwtAuthGuardUser)
@Controller('goal')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private readonly goalUserService : GoalUserService
  ) {}

  @Post()
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @I18n() i18n: I18nContext,
    @Req() req: Request,
  ) {
    const user = req['user'];
    createGoalDto.created_by = +user.sub;
    const goal = await this.goalService.create(createGoalDto);
    await this.goalUserService.create(goal.id, +user.sub, i18n.t('goal.add_error'));
    return { message: i18n.t('goal.create_success'), data: goal };
  }

  @Post('add/user')
  async addUser(
    @Body() addUserGoalDto: addUserGoalDto,
    @I18n() i18n: I18nContext,
  ) {
    const { goal_id, user_id } = addUserGoalDto;
    
    const goal_user = await this.goalUserService.create(goal_id, user_id, i18n.t('goal.add_error'));
    return { 
      message: i18n.t('goal.add_success'),
      data: goal_user
    };
  }

  @Get()
  async findAllByUser(@Req() req: Request) {
    const user = req['user']; 
    const goal = await this.goalService.findAllByUser(+user.sub);
    return { data: goal }
  }

  @Get(':id')
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const goal = await this.goalService.findOne(id, i18n.t('goal.goal_not_found'));
    return { data: goal };
  }

  @Put(':id')
  async update(
    @ParseId('id') id: number,
    @Body() updateGoalDto: UpdateGoalDto,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    updateGoalDto.updated_by = +user.sub;
    const goal = await this.goalService.update(id, updateGoalDto, i18n);

    return { 
      message: i18n.t('goal.update_success'),
      data: goal
    };
  }

  @Delete('out/:id')
  async out(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const isCreator = await this.goalService.isUserCreator(+user.sub, id);
    if (isCreator) {
      throw new BadRequestException(i18n.t('goal.out_error'));
    }
    const goal_user = await this.goalUserService.remove(id, +user.sub, i18n.t('goal.user_not_found'));
    return { 
      message: i18n.t('goal.out_success'),
      data: goal_user
    };
  }

  @Post('out')
  async removeOtherUser(
    @Body() body: { goal_id: number; user_id: number },
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const { goal_id, user_id } = body;
    const isUserCreator = await this.goalService.isUserCreator(+user.sub, +goal_id);
    if (isUserCreator) {
      const budget_user = await this.goalUserService.remove(+goal_id, +user_id, i18n.t('goal.user_not_found'));
      return { 
        message: i18n.t('goal.rm_user_success'),
        data: budget_user
      };
    }
    throw new BadRequestException(i18n.t('goal.rm_user_error'));
  }

  @Delete(':id')
  async remove(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const isCreator = await this.goalService.isUserCreator(+user.sub, id);
    if (!isCreator) {
      throw new BadRequestException(i18n.t('goal.delete_error'));
    }
    const goal= await this.goalService.remove(id, i18n.t('goal.goal_not_found'));
    return { 
      message: i18n.t('goal.delete_success'),
      data: goal
    };
  }
}
