import { IsInt } from 'class-validator';

export class addUserBudgetDto {
  @IsInt()
  budget_id: number;

  @IsInt()
  user_id: number;
}
