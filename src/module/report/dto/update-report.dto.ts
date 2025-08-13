import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
    @IsOptional()
    status?: number; // 0 = pending, 1 = resolved

    @IsOptional()
    @IsString()
    response?: string;
}
