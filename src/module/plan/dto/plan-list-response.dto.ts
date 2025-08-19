import { ApiProperty } from '@nestjs/swagger';
import { Plan } from 'src/entities/Plan.entity';

export class PlanListResponseDto {
  @ApiProperty({ type: [Plan] })
  data: Plan[];
}
