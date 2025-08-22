import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'src/entities/Transaction.entity';

// --- DTO for Create ---
export class TransactionResponseDto {
    @ApiProperty({ example: 'success', description: 'Trạng thái (success | near_budget | over_budget)' })
    status: string;
    @ApiProperty({ example: 'Tạo mới thành công' })
    message: string;
    @ApiProperty({ type: Transaction })
    data: Transaction;
}

// --- DTO for List ---
export class PaginatedTransactionsResponseDto {
    @ApiProperty({ type: [Transaction] })
    transactions: Transaction[];
    @ApiProperty({ example: 1 })
    currentPage: number;
    @ApiProperty({ example: 10 })
    totalPages: number;
    @ApiProperty({ example: 10 })
    limit: number;
}

// --- DTO for Update ---
export class UpdateTransactionResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Cập nhật thành công' })
    message: string;
    @ApiProperty({ type: Transaction })
    data: Transaction;
}

// --- DTO for Delete ---
export class DeleteTransactionResponseDto {
    @ApiProperty({ example: true })
    status: boolean;
    @ApiProperty({ example: 'Xoá thành công' })
    message: string;
    @ApiProperty({ type: Transaction })
    data: Transaction;
}

// --- DTO for Import ---
export class ImportExcelResponseDto {
    @ApiProperty({ example: 'Import thành công. Đã nhập 5 dòng.' })
    message: string;
    @ApiProperty({ example: 5 })
    count: number;
    @ApiProperty({ type: [String], example: ["Bạn đã vượt quá ngân sách cho Ăn uống (120%)."] })
    warnings: string[];
}

// --- DTO for Import Error ---
export class ImportExcelErrorResponseDto {
    @ApiProperty({ 
        example: 'Nhập dữ liệu thất bại', 
        description: 'Thông báo lỗi chung.' 
    })
    message: string;

    @ApiProperty({ 
        type: [String], 
        example: ["Dòng 2: Danh mục 'Ăn vặt' không tồn tại"], 
        description: 'Danh sách các lỗi chi tiết theo từng dòng (nếu có).',
        required: false
    })
    errors?: string[];
}
