import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { User } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecurringListResponseDto, RecurringResponseDto, updateRecurringResponseDto, deleteRecurringResponseDto } from './dto/recurring-response.dto';

@ApiTags('Recurring Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardUser)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post('transaction/:id')
  @ApiOperation({ summary: 'Tạo một giao dịch định kỳ cho một giao dịch có sẵn' })
  @ApiParam({ name: 'id', description: 'ID của giao dịch gốc' })
  @ApiResponse({ status: 201, description: 'Tạo giao dịch định kỳ thành công', type: RecurringResponseDto })
  @ApiResponse({ status: 404, description: 'Giao dịch không tồn tại' })
  async create(
    @Body() createRecurringDto: CreateRecurringDto,
    @I18n() i18n: I18nContext,
    @ParseId('id') id: number,
  ) {
    createRecurringDto.transaction_id = id;
    const recurring = await this.recurringService.create(
      createRecurringDto,
      i18n,
    );
    return {
      status: true,
      message: i18n.t('recurring.create_success'),
      data: recurring,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả giao dịch định kỳ của người dùng' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: RecurringListResponseDto })
  async findAllByUser(@User() user) {
    const data = await this.recurringService.findAllByUser(+user.sub);
    return { data: data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin giao dịch định kỳ theo ID của nó' })
  @ApiParam({ name: 'id', description: 'ID của giao dịch định kỳ' })
  @ApiResponse({ status: 200, description: 'Thành công.', type: RecurringListResponseDto })
  async findAllByTransaction(@ParseId('id') id: number) {
    const data = await this.recurringService.findByTransaction(+id);
    return { data: data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật một giao dịch định kỳ' })
  @ApiParam({ name: 'id', description: 'ID của giao dịch định kỳ' })
  @ApiResponse({ status: 200, description: 'Cập nhật giao dịch định kỳ thành công', type: updateRecurringResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giao dịch định kỳ' })
  async update(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    const recurring = await this.recurringService.update(+id, updateRecurringDto, i18n);
    return {
      status: true,
      message: i18n.t('recurring.update_success'),
      data: recurring
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một giao dịch định kỳ' })
  @ApiParam({ name: 'id', description: 'ID của giao dịch định kỳ' })
  @ApiResponse({ status: 200, description: 'Xóa giao dịch định kỳ thành công', type: deleteRecurringResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giao dịch định kỳ' })
  async remove(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const recurring = await this.recurringService.remove(+id, i18n);
    return {
      status: true,
      message: i18n.t('recurring.delete_success'),
      data: recurring
    }
  }
}
