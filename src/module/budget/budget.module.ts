import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/entities/Budget.entity';
import { BudgetUserModule } from '../budget-user/budget-user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { BudgetUser } from 'src/entities/BudgetUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetUser]),
    BudgetUserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
