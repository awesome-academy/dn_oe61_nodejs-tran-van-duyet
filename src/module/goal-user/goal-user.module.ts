import { Module } from '@nestjs/common';
import { GoalUserService } from './goal-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalUser } from 'src/entities/GoalUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalUser])],
  providers: [GoalUserService],
  exports: [GoalUserService],
})
export class GoalUserModule {}
