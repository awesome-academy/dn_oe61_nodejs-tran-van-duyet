import { Module } from '@nestjs/common';
import { BudgetUserService } from './budget-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetUser } from 'src/entities/BudgetUser.entity';
import { User } from 'src/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetUser, User])],
  providers: [BudgetUserService],
  exports: [BudgetUserService]
})
export class BudgetUserModule {}
