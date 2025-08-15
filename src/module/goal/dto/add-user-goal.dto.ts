import { IsNumber } from 'class-validator';

export class addUserGoalDto {
  @IsNumber()
  goal_id: number;

  @IsNumber()
  user_id: number;
}
