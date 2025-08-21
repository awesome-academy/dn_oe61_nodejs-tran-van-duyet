import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class addUserBudgetDto {
  @ApiProperty({ description: 'ID của ngân sách', example: 1 })
  @IsInt()
  budget_id: number;

  @ApiProperty({ description: 'ID của người dùng cần thêm/xóa', example: 2 })
  @IsInt()
  user_id: number;
}
