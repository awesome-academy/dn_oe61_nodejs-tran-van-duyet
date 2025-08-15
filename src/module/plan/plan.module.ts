import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { Plan } from 'src/entities/Plan.entity';
import { PlanController } from './plan.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Plan])],
    controllers: [PlanController],
    providers: [PlanService],
    exports: [PlanService],
})
export class PlanModule {}
