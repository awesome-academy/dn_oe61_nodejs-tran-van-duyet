import { ApiProperty } from '@nestjs/swagger';
import { Plan } from 'src/entities/Plan.entity';

export class PlanResponseDto {
  @ApiProperty({ type: () => Plan })
  data: Plan;
}
