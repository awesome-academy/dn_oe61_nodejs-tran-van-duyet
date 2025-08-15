import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  Put,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BudgetUserService } from '../budget-user/budget-user.service';
import { User } from 'src/common/decorators/user.decorator';
import { addUserBudgetDto } from './dto/add-user-budget.dto';
import { ParseId } from 'src/common/decorators/parse-id.decorator';

@UseGuards(JwtAuthGuardUser)
@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetUserService: BudgetUserService,
  ) {}

  @Post()
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    createBudgetDto.created_by = +user.sub;
    const budget = await this.budgetService.create(createBudgetDto, i18n);
    await this.budgetUserService.create(+budget.id, +user.sub, i18n);
    return { 
      message: i18n.t('budget.create_success'),
      data: budget
    };
  }

  @Post('add/user')
  async addUser(
    @Body() body: addUserBudgetDto,
    @I18n() i18n: I18nContext,
  ) {
    const { budget_id, user_id } = body;
    const budget_user = await this.budgetUserService.create(budget_id, user_id, i18n);

    return { 
      message: i18n.t('budget.add_success'),
      data: budget_user
    };
  }

  //Get budget and budget partners information
  @Get()
  async findAllByUser(
    @User() user,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const budget = await this.budgetService.findAllByUser(+user.sub, pageNumber, limitNumber);
    return { data: budget }
  }

  @Get(':id')
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const budget = await this.budgetService.findBudgetDetail(id, i18n);
    return { data: budget }
  }

  @Put(':id')
  async update(
    @ParseId('id') id: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @I18n() i18n: I18nContext,
    @Req() req: Request,
  ) {
    const user = req['user'];
    updateBudgetDto.updated_by = user.sub;
    
    const budget = await this.budgetService.update(+id, updateBudgetDto, i18n);
    return { 
      message: i18n.t('budget.update_success'),
      data: budget
    };
  }

  @Delete('out/:id')
  async out(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, id);
    if (isUserCreate) {
      throw new BadRequestException(i18n.t('budget.out_error'));
    }
    const budget_user = await this.budgetUserService.remove(id, +user.sub, i18n);
    return { 
      message: i18n.t('budget.out_success'),
      data: budget_user
    };
  }

  @Post('out')
  async removeOtherUser(
    @Body() body: addUserBudgetDto,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const { budget_id, user_id } = body;
    const isUserCreator = await this.budgetService.isUserCreator(+user.sub, +budget_id);
    if (isUserCreator) {
      const budget_user = await this.budgetUserService.remove(+budget_id, +user_id, i18n);
      return { 
        message: i18n.t('budget.rm_user_success'), 
        data: budget_user
      };
    }
    throw new BadRequestException(i18n.t('budget.rm_user_error'));
  }

  @Delete(':id')
  async remove(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, id);
    if (!isUserCreate) {
      throw new BadRequestException(i18n.t('budget.delete_error'));
    }
    const budget = await this.budgetService.remove(id);
    return { 
      message: i18n.t('budget.delete_success'),
      data: budget
    }
  }
}
