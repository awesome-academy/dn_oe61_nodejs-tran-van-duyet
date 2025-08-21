import { ApiProperty } from '@nestjs/swagger';
import { FeedbackReport } from 'src/entities/FeedbackReport.entity';

// --- DTO for Single Response (Create, Update) ---
export class createReportResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Tạo feedback/report thành công.' })
    message: string;
    @ApiProperty({ type: FeedbackReport })
    data: FeedbackReport;
}

export class updateReportResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Cập nhật feedback/report thành công.' })
    message: string;
    @ApiProperty({ type: FeedbackReport })
    data: FeedbackReport;
}

// --- DTO for User's List ---
class UserReportListDataDto {
    @ApiProperty({ type: [FeedbackReport] })
    data: FeedbackReport[];
    @ApiProperty({ example: 1 })
    currentPage: number;
    @ApiProperty({ example: 5 })
    totalPages: number;
    @ApiProperty({ example: 10 })
    limit: number;
}
export class UserReportListResponseDto {
    @ApiProperty({ type: UserReportListDataDto })
    data: UserReportListDataDto;
}
