import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CostService } from './cost.service';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuardUser)
@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Get('summary')
  async getSummary(
    @User() user,
    @Query('categoryId') categoryId?: number,
    @Query('date') date?: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.costService.getTransactionsSummary(+user.sub, {
      categoryId: categoryId ? +categoryId : undefined,
      date,
      month: month ? +month : undefined,
      year: year ? +year : undefined,
    });
  }
}
