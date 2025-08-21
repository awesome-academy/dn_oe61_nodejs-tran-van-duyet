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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BudgetDetailResponseDto,
  BudgetListResponseDto,
  deleteUserResponseDto,
  CreateBudgetResponseDto,
  DeleteBudgetResponseDto,
  UpdateBudgetResponseDto,
  AddUserBudgetResponseDto,
  outUserResponseDto,
} from './dto/budget-responses.dto';

@ApiTags('Budget')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardUser)
@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetUserService: BudgetUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một ngân sách mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo ngân sách thành công.',
    type: CreateBudgetResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Ngân sách đã tồn tại.' })
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    createBudgetDto.created_by = +user.sub;
    const budget = await this.budgetService.create(createBudgetDto, i18n);
    await this.budgetUserService.create(+budget.id, +user.sub, i18n);
    return {
      message: i18n.t('budget.create_success'),
      data: budget,
    };
  }

  @Post('add/user')
  @ApiOperation({ summary: 'Thêm người dùng vào một ngân sách' })
  @ApiResponse({
    status: 201,
    description: 'Thêm người dùng thành công',
    type: AddUserBudgetResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Người dùng này đã có' })
  async addUser(@Body() body: addUserBudgetDto, @I18n() i18n: I18nContext) {
    const { budget_id, user_id } = body;
    const budget_user = await this.budgetUserService.create(
      budget_id,
      user_id,
      i18n,
    );

    return {
      message: i18n.t('budget.add_success'),
      data: budget_user,
    };
  }

  //Get budget and budget partners information
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách ngân sách của người dùng (phân trang)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Thành công.',
    type: BudgetListResponseDto,
  })
  async findAllByUser(
    @User() user,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const budget = await this.budgetService.findAllByUser(
      +user.sub,
      pageNumber,
      limitNumber,
    );
    return { data: budget };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một ngân sách' })
  @ApiParam({ name: 'id', description: 'ID của ngân sách' })
  @ApiResponse({
    status: 200,
    description: 'Thành công.',
    type: BudgetDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hạn mức chi tiêu' })
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const budget = await this.budgetService.findBudgetDetail(id, i18n);
    return { data: budget };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật một ngân sách' })
  @ApiParam({ name: 'id', description: 'ID của ngân sách' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật ngân sách thành công.',
    type: UpdateBudgetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hạn mức chi tiêu' })
  @ApiResponse({
    status: 409,
    description: 'Ngân sách theo danh mục này đã có rồi',
  })
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
      data: budget,
    };
  }

  @Delete('out/:id')
  @ApiOperation({ summary: 'Người dùng tự rời khỏi một ngân sách' })
  @ApiParam({ name: 'id', description: 'ID của ngân sách' })
  @ApiResponse({
    status: 200,
    description: 'Rời khỏi thành công',
    type: outUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bạn không thể rời khỏi' })
  async out(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, id);
    if (isUserCreate) {
      throw new BadRequestException(i18n.t('budget.out_error'));
    }
    const budget_user = await this.budgetUserService.remove(
      id,
      +user.sub,
      i18n,
    );
    return {
      message: i18n.t('budget.out_success'),
      data: budget_user,
    };
  }

  @Post('out')
  @ApiOperation({ summary: 'Người tạo xóa người dùng khác khỏi ngân sách' })
  @ApiResponse({
    status: 200,
    description: 'Xoá người dùng thành công',
    type: deleteUserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bạn không có quyền này' })
  async removeOtherUser(
    @Body() body: addUserBudgetDto,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    const { budget_id, user_id } = body;
    const isUserCreator = await this.budgetService.isUserCreator(
      +user.sub,
      +budget_id,
    );
    if (isUserCreator) {
      const budget_user = await this.budgetUserService.remove(
        +budget_id,
        +user_id,
        i18n,
      );
      return {
        message: i18n.t('budget.rm_user_success'),
        data: budget_user,
      };
    }
    throw new BadRequestException(i18n.t('budget.rm_user_error'));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một ngân sách (chỉ người tạo)' })
  @ApiParam({ name: 'id', description: 'ID của ngân sách' })
  @ApiResponse({
    status: 200,
    description: 'Xóa ngân sách thành công.',
    type: DeleteBudgetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Xóa ngân sách thất bại.' })
  async remove(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    const isUserCreate = await this.budgetService.isUserCreator(+user.sub, id);
    if (!isUserCreate) {
      throw new BadRequestException(i18n.t('budget.delete_error'));
    }
    const budget = await this.budgetService.remove(id);
    return {
      message: i18n.t('budget.delete_success'),
      data: budget,
    };
  }
}
