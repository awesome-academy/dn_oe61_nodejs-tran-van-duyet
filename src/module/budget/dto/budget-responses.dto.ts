import { ApiProperty } from '@nestjs/swagger';
import { Budget } from 'src/entities/Budget.entity';
import { BudgetUser } from 'src/entities/BudgetUser.entity';
import { User } from 'src/entities/User.entity';

// --- DTO for Create/Update ---
class BasicBudgetDataDto {
    @ApiProperty() id: number;
    @ApiProperty() category_id: number;
    @ApiProperty() limit_amount: number;
    @ApiProperty() period: number;
    @ApiProperty() start_date: Date;
    @ApiProperty() end_date: Date;
    @ApiProperty() created_by: number;
    @ApiProperty() updated_by: number;
    @ApiProperty() created_at: Date;
    @ApiProperty() updated_at: Date;
}
export class CreateBudgetResponseDto {
    @ApiProperty({ example: 'Tạo ngân sách thành công.' }) message: string;
    @ApiProperty({ type: BasicBudgetDataDto }) data: BasicBudgetDataDto;
}
export class UpdateBudgetResponseDto {
    @ApiProperty({ example: 'Cập nhật ngân sách thành công.' }) message: string;
    @ApiProperty({ type: BasicBudgetDataDto }) data: BasicBudgetDataDto;
}

// --- DTO for List ---
class BudgetUserSummaryDto {
    @ApiProperty() id: number;
    @ApiProperty({ type: User }) user: User;
}
class BudgetSummaryDto {
    @ApiProperty() id: number;
    @ApiProperty() limit_amount: number;
    @ApiProperty() period: number;
    @ApiProperty() start_date: Date;
    @ApiProperty() end_date: Date;
    @ApiProperty({ type: [BudgetUserSummaryDto] }) budgetUsers: BudgetUserSummaryDto[];
}
class BudgetListDataDto {
    @ApiProperty({ type: [BudgetSummaryDto] }) data: BudgetSummaryDto[];
    @ApiProperty() total: number;
    @ApiProperty() page: number;
    @ApiProperty() limit: number;
    @ApiProperty() totalPages: number;
}
export class BudgetListResponseDto {
    @ApiProperty({ type: BudgetListDataDto }) data: BudgetListDataDto;
}

// --- DTO for Detail ---
export class BudgetDetailResponseDto {
    @ApiProperty({ type: Budget }) data: Budget;
}

// --- DTO for Add User ---
class AddUserBudgetDataDto_Budget {
    @ApiProperty({ example: 12 }) id: number;
}
class AddUserBudgetDataDto_User {
    @ApiProperty({ example: 34 }) id: number;
}
class AddUserBudgetDataDto {
    @ApiProperty({ example: 11 }) id: number;
    @ApiProperty({ type: AddUserBudgetDataDto_Budget }) budget: AddUserBudgetDataDto_Budget;
    @ApiProperty({ type: AddUserBudgetDataDto_User }) user: AddUserBudgetDataDto_User;
}
export class AddUserBudgetResponseDto {
    @ApiProperty({ example: 'Thêm người dùng thành công' }) message: string;
    @ApiProperty({ type: AddUserBudgetDataDto }) data: AddUserBudgetDataDto;
}

// --- DTO for BudgetUser operations ---
export class deleteUserResponseDto {
    @ApiProperty({ example: 'Xoá người dùng khỏi ngân sách thành công' }) message: string;
    @ApiProperty({ example: {id: 4} }) data: {id: number};
}

export class outUserResponseDto {
    @ApiProperty({ example: 'Rời ngân sách thành công' }) message: string;
    @ApiProperty({ example: {id: 4} }) data: {id: number};
}

// --- DTO for Delete ---
export class DeleteBudgetResponseDto {
    @ApiProperty({ example: 'Xóa ngân sách thành công.' }) message: string;
    @ApiProperty({ type: BasicBudgetDataDto }) data: BasicBudgetDataDto;
}
