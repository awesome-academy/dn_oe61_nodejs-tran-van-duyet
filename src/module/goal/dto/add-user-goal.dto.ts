import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserGoalDto {
  @ApiProperty({ description: 'ID của mục tiêu', example: 1 })
  @IsNumber()
  goal_id: number;

  @ApiProperty({ description: 'ID của người dùng cần thêm', example: 2 })
  @IsNumber()
  user_id: number;
}
