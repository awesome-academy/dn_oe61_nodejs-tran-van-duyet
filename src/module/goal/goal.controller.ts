import { Controller, Get, Post, Body, Delete, UseGuards, Req, BadRequestException, Put } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalUserService } from '../goal-user/goal-user.service';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AddUserGoalDto } from './dto/add-user-goal.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { createGoalResponseDto, updateGoalResponseDto, deleteGoalResponseDto, getGoalResponseDto, GoalListResponseDto, GoalUserResponseDto, outGoalResponseDto, outUserGoalResponseDto } from './dto/goal-response.dto';
import { RemoveUserGoalDto } from './dto/remove-user-goal.dto';

@ApiTags('Goal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardUser)
@Controller('goal')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private readonly goalUserService : GoalUserService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một mục tiêu mới' })
  @ApiResponse({ status: 201, description: 'Tạo mục tiêu thành công.', type: createGoalResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực.' })
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
  @ApiOperation({ summary: 'Thêm một người dùng vào mục tiêu' })
  @ApiResponse({ status: 201, description: 'Thêm thành viên vào Goal thành công', type: GoalUserResponseDto })
  @ApiResponse({ status: 409, description: 'Người dùng này đã có' })
  async addUser(
    @Body() addUserGoalDto: AddUserGoalDto,
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
  @ApiOperation({ summary: 'Lấy danh sách mục tiêu của người dùng đã đăng nhập' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: GoalListResponseDto })
  async findAllByUser(@Req() req: Request) {
    const user = req['user']; 
    const goal = await this.goalService.findAllByUser(+user.sub);
    return { data: goal }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một mục tiêu' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: getGoalResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const goal = await this.goalService.findOne(id, i18n.t('goal.goal_not_found'));
    return { data: goal };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật một mục tiêu' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu' })
  @ApiResponse({ status: 200, description: 'Cập nhật mục tiêu thành công.', type: updateGoalResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
  @ApiResponse({ status: 409, description: 'Mục tiêu này đã tồn tại' })
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
  @ApiOperation({ summary: 'Người dùng tự rời khỏi một mục tiêu' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu cần rời' })
  @ApiResponse({ status: 200, description: 'Rời khỏi thành công', type: outGoalResponseDto })
  @ApiResponse({ status: 400, description: 'Bạn không thể rời khỏi' })
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
  @ApiOperation({ summary: 'Người tạo xóa một người dùng khác khỏi mục tiêu' })
  @ApiBody({ type: RemoveUserGoalDto })
  @ApiResponse({ status: 200, description: 'Xoá người dùng thành công', type: outUserGoalResponseDto })
  @ApiResponse({ status: 400, description: 'Bạn không có quyền này' })
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
  @ApiOperation({ summary: 'Xóa một mục tiêu (chỉ người tạo)' })
  @ApiParam({ name: 'id', description: 'ID của mục tiêu' })
  @ApiResponse({ status: 200, description: 'Xóa mục tiêu thành công.', type: deleteGoalResponseDto })
  @ApiResponse({ status: 400, description: 'Bạn không có quyền xoá' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mục tiêu' })
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
