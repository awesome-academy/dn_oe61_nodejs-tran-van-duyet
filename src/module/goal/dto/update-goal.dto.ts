import { PartialType } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
    @IsOptional()
    @IsInt()
    updated_by?: number;
}
