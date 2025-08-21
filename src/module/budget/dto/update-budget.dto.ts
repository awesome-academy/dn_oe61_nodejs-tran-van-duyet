import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
    @IsOptional()
    @IsInt()
    updated_by?: number;
}
