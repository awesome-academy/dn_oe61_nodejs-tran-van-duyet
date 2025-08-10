import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
    @Req() req: Request,
  ) {
    const user = req['user'];
    createBudgetDto.created_by = +user.sub;
    const t = i18n.t('budget') as any;
    const check = await this.budgetService.create(createBudgetDto);
    if (!check) {
      throw new BadRequestException(t.create_error);
    }
    await this.budgetUserService.create(+check.id, +user.sub);
    return { message: t.create_success };
  }

  @Post('add/user')
  async addUser(
    @Body() body: { budget_id: number; user_id: number },
    @I18n() i18n: I18nContext,
  ) {
    const { budget_id, user_id } = body;
    const t = i18n.t('budget') as any;

    const budget = await this.budgetUserService.create(budget_id, user_id);
    if(!budget) {
      throw new BadRequestException(t.add_error);
    }

    return { message: t.add_success };
  }

  //Get budget and budget partners information
  @Get()
  async findAllByUser(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const user = req['user'];
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return this.budgetService.findAllByUser(+user.sub, pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @I18n() i18n: I18nContext,
    @Req() req: Request,
  ) {
    const t = i18n.t('budget') as any;
    const user = req['user'];
    updateBudgetDto.updated_by = user.sub;
    
    const budget = await this.budgetService.update(+id, updateBudgetDto);
    if (!budget) {
      throw new BadRequestException(t.update_error);
    }
    return { message: t.update_success }
  }

  @Delete('out/:id')
  async out(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
    @Req() req: Request,
  ) {
    const t = i18n.t('budget') as any;
    const user = req['user'];
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, +id);
    if (isUserCreate) {
      throw new BadRequestException(t.out_error);
    }
    await this.budgetUserService.remove(+id, +user.sub);
    return { message: t.out_success}
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @I18n() i18n: I18nContext,
    @Req() req: Request
  ) {
    const t = i18n.t('budget') as any;
    const user = req['user'];
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, +id);
    if (!isUserCreate) {
      throw new BadRequestException(t.delete_error);
    }
    await this.budgetService.remove(+id);
    return { message: t.delete_success }
  }
}
