import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackReport } from 'src/entities/FeedbackReport.entity';
import { Repository } from 'typeorm';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(FeedbackReport)
    private readonly feedbackReportsRepository: Repository<FeedbackReport>
  ){}
  async create(createReportDto: CreateReportDto): Promise<FeedbackReport> {
    const report = await this.feedbackReportsRepository.create(createReportDto);
    return await this.feedbackReportsRepository.save(report);
  }

  async findAll(page: number, limit: number): Promise<[any[], number]> {
    const [result, total] = await this.feedbackReportsRepository.findAndCount({
      relations: ['user'],        
      skip: (page - 1) * limit,   
      take: limit,
      order: { id: 'DESC' },      
    });

    const mappedResult = result.map(f => ({
      id: f.id,
      type: f.type,
      content: f.content,
      status: f.status,
      response: f.response,
      created_at: f.created_at,
      updated_at: f.updated_at,
      user_name: f.user?.name || null,
    }));

    return [mappedResult, total];
  }

  async findAllByUser(user_id: number, page: number, limit: number): Promise<[FeedbackReport[], number]> {
    const [result, total] = await this.feedbackReportsRepository.findAndCount({
      where: { user_id },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return [result, total];
  }

  async update(id: number, updateReportDto: UpdateReportDto, i18n: I18nContext): Promise<FeedbackReport | null> {
    const reports = await this.feedbackReportsRepository.findOne({ where: { id } });
    if (!reports) {
      throw new NotFoundException(i18n.t('report.report_not_found'));
    }
    await this.feedbackReportsRepository.update(id, updateReportDto)
    const report = await this.feedbackReportsRepository.findOneBy({id});
    return report;
  }

  async remove(id: number, i18n: I18nContext): Promise<FeedbackReport> {
    const reports = await this.feedbackReportsRepository.findOne({ where: { id } }); 
    if (!reports) {
      throw new NotFoundException(i18n.t('report.report_not_found'));
    }
    await this.feedbackReportsRepository.delete(id);
    return reports;
  }
}
