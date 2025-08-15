import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/Transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Category } from 'src/entities/Category.entity';
import { Currency } from 'src/entities/Currency.entity';
import { Budget } from 'src/entities/Budget.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category, Currency, Budget]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
