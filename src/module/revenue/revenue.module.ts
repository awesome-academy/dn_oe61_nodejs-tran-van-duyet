import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryUserPlan } from 'src/entities/HistoryUserPlan.entity';
import { User } from 'src/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Plan } from 'src/entities/Plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryUserPlan, User, Plan]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
