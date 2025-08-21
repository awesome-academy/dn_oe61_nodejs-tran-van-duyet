import { ApiProperty } from '@nestjs/swagger';
import { RecurringTransaction } from 'src/entities/RecurringTransaction.entity';

// --- DTO for Single Response (Create, Update, Delete) ---
export class RecurringResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Tạo giao dịch định kỳ thành công' })
    message: string;
    @ApiProperty({ type: RecurringTransaction })
    data: RecurringTransaction;
}

export class updateRecurringResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Cập nhật giao dịch định kỳ thành công' })
    message: string;
    @ApiProperty({ type: RecurringTransaction })
    data: RecurringTransaction;
}

export class deleteRecurringResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Xoá giao dịch định kỳ thành công' })
    message: string;
    @ApiProperty({ type: RecurringTransaction })
    data: RecurringTransaction;
}

// --- DTO for List Response ---
export class RecurringListResponseDto {
    @ApiProperty({ type: [RecurringTransaction] })
    data: RecurringTransaction[];
}
