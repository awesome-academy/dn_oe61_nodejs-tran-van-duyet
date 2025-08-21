import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/User.entity';

class GoalUserSummaryDto {
  @ApiProperty()
  id: number;
  @ApiProperty({ type: () => User })
  user: User;
}

export class GoalSummaryDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  target_amount: number;
  @ApiProperty()
  target_date: Date;
  @ApiProperty()
  description: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;
  @ApiProperty({ type: [GoalUserSummaryDto] })
  goalUsers: GoalUserSummaryDto[];
}

