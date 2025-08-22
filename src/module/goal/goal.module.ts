import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from 'src/entities/Goal.entity';
import { GoalUserModule } from '../goal-user/goal-user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { GoalUser } from 'src/entities/GoalUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, GoalUser]),
    GoalUserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GoalController],
  providers: [GoalService],
})
export class GoalModule {}
