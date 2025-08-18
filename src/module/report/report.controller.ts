import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Render,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { userUpdateReportDto } from './dto/user-update.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/config/pagination.constant';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuardUser)
  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @I18n() i18n: I18nContext,
    @User() user,
  ) {
    createReportDto.user_id = user.sub;
    const report = await this.reportService.create(createReportDto);
    return {
      status: true,
      message: i18n.t('report.create_success'),
      data: report,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Render('report/index')
  async findAll(
    @Query('page') page = DEFAULT_PAGE,
    @Query('limit') limit = DEFAULT_LIMIT,
    @I18n() i18n: I18nContext,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [report, total] = await this.reportService.findAll(
      pageNumber,
      pageSize,
    );
    const totalPages = Math.ceil(total / pageSize);
    return {
      data: report,
      t: i18n.t('report'),
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
      isReportPage: true,
      l: i18n.t('layout')
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('json')
  async getResponseJson(
    @Query('page') page = DEFAULT_PAGE,
    @Query('limit') limit = DEFAULT_LIMIT,
    @I18n() i18n: I18nContext,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [report, total] = await this.reportService.findAll(
      pageNumber,
      pageSize,
    );
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: report,
      t: i18n.t('report'),
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
      isReportPage: true,
    };
  }

  @UseGuards(JwtAuthGuardUser)
  @Get('my')
  async findAllByUser(
    @User() user,
    @Query('page') page = DEFAULT_PAGE,
    @Query('limit') limit = DEFAULT_LIMIT,
  ) {
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const [report, total] = await this.reportService.findAllByUser(+user.sub, pageNumber, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return { 
      data: report,
      currentPage: pageNumber,
      totalPages,
      limit: pageSize,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @ParseId('id') id: number,
    @Body() updateReportDto: UpdateReportDto,
    @I18n() i18n: I18nContext,
  ) {
    
    const report = await this.reportService.update(
      id,
      updateReportDto,
      i18n.t('report.report_not_found'),
    );
    return {
      status: true,
      message:i18n.t('report.update_success'),
      data: report
    }
  }

  @UseGuards(JwtAuthGuardUser)
  @Patch('user/:id')
  async userUpdate(
    @ParseId('id') id: number,
    @Body() userUpdateReportDto: userUpdateReportDto,
    @I18n() i18n: I18nContext,
  ) {
    const report = await this.reportService.update(
      id,
      userUpdateReportDto,
      i18n,
    );
    return {
      status: true,
      message:i18n.t('report.update_success'),
      data: report
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const report = await this.reportService.remove(id, i18n);
    return {
      status: true,
      message: i18n.t('report.delete_success'),
      data: report
    }
  }
}
