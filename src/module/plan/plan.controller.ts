import { Controller, Get, Param, Res } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Get()
    async findAll() {
        return this.planService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.planService.findOne(+id);
    }
}
