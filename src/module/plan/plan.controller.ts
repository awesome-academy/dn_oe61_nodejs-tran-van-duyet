import {
  Controller,
  Get
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  async findAll() {
    const data = await this.planService.findAll();
    return {data: data};
  }

  @Get(':id')
  async findOne(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const data = await this.planService.findOne(id);
    return {data: data};
  }
}
