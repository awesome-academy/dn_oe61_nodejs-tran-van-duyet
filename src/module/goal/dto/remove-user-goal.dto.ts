import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveUserGoalDto {
  @ApiProperty({ description: 'ID của mục tiêu', example: 1 })
  @IsNumber()
  goal_id: number;

  @ApiProperty({ description: 'ID của người dùng cần xóa', example: 2 })
  @IsNumber()
  user_id: number;
}
