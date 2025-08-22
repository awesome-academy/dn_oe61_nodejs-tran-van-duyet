import { Module } from '@nestjs/common';
import { GoalUserService } from './goal-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalUser } from 'src/entities/GoalUser.entity';
import { User } from 'src/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalUser, User])],
  providers: [GoalUserService],
  exports: [GoalUserService],
})
export class GoalUserModule {}
