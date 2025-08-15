import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Plan } from 'src/entities/Plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plan])],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
