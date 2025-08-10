import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuardUser)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user,
    @I18n() i18n: I18nContext,
  ) {
    const user_id = user.sub;
    createTransactionDto.user_id = user_id;
    const result = await this.transactionService.create(createTransactionDto, i18n);
    return {
      status: result.status,
      message: result.message,
      data: result.data,
    };
  }

  @Get()
  async findAllByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @User() user
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const user_id = user.sub;
    const [transactions, total] = await this.transactionService.findAllByUser(
      pageNumber,
      pageSize,
      user_id,
    );
    const totalPages = Math.ceil(total / pageSize);
    return {
      transactions,
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
    };
  }

  @Put(':id')
  async update(
    @ParseId('id') id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @I18n() i18n: I18nContext,
  ) {
    const transaction = await this.transactionService.update(id, updateTransactionDto, i18n);
    return { 
      message: i18n.t('transaction.update_success'),
      data: transaction
    };
  }

  @Delete(':id')
  async remove(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const transaction = await this.transactionService.remove(id, i18n);
    return { 
      message: i18n.t('transaction.delete_success'),
      data: transaction
    };
  }

  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @I18n() i18n: I18nContext,
    @User() user
  ) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    // Send data to service for processing
    return await this.transactionService.importFromExcel(jsonData, +user.sub, i18n);
  }
}
