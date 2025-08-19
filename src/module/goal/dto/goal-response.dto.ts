import { ApiProperty } from '@nestjs/swagger';
import { Goal } from 'src/entities/Goal.entity';
import { GoalSummaryDto } from './goal-summary.dto';
import { GoalUser } from 'src/entities/GoalUser.entity';

class GoalDataDto {
  @ApiProperty({ example: 4 })
  id: number;

  @ApiProperty({ example: 'Mua laptop mới' })
  name: string;

  @ApiProperty({ example: 25000000 })
  target_amount: number;

  @ApiProperty({ example: '2025-12-31' })
  target_date: string;

  @ApiProperty({ example: 'Tiết kiệm để mua Macbook Pro M3' })
  description: string;

  @ApiProperty({ example: 15 })
  created_by: number;

  @ApiProperty({ example: 3})
  updated_by: number | null;

  @ApiProperty({ example: '2025-08-20T10:18:09.395Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-08-20T10:18:09.395Z' })
  updated_at: Date;
}

export class createGoalResponseDto {
  @ApiProperty({ example: 'Tạo mục tiêu thành công.' })
  message: string;

  @ApiProperty({ type: () => GoalDataDto })
  data: GoalDataDto;
}

export class getGoalResponseDto {
  @ApiProperty({ type: () => Goal })
  data: Goal;
}

export class updateGoalResponseDto {
  @ApiProperty({ example: 'Cập nhật mục tiêu thành công' })
  message: string;

  @ApiProperty({ type: () => GoalDataDto })
  data: GoalDataDto;
}

export class deleteGoalResponseDto {
  @ApiProperty({ example: 'Xoá mục tiêu thành công' })
  message: string;

  @ApiProperty({ type: () => GoalDataDto })
  data: GoalDataDto;
}

export class outGoalResponseDto {
  @ApiProperty({ example: 'Rời khỏi thành công' })
  message: string;

  @ApiProperty({ example: {id: 4} })
  data: {id: number};
}

export class outUserGoalResponseDto {
  @ApiProperty({ example: 'Xoá người dùng thành công' })
  message: string;

  @ApiProperty({ example: {id: 4} })
  data: {id: number};
}

export class GoalListResponseDto {
  @ApiProperty({ type: [GoalSummaryDto] })
  data: GoalSummaryDto[];
}

export class GoalUserResponseDto {
  @ApiProperty({ example: 'Thêm người dùng vào mục tiêu thành công' })
  message: string;

  @ApiProperty({ type: () => GoalUser })
  data: GoalUser;
}


