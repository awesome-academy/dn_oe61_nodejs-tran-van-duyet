import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringController } from './recurring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringTransaction } from 'src/entities/RecurringTransaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Transaction } from 'src/entities/Transaction.entity';
import { RecurringProcessorService } from './RecurringProcessor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringTransaction, Transaction]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [RecurringController],
  providers: [RecurringService, RecurringProcessorService],
})
export class RecurringModule {}
