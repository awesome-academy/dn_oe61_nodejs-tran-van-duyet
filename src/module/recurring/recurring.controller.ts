import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseId } from 'src/common/decorators/parse-id.decorator';
import { JwtAuthGuardUser } from '../auth/jwt-auth.guard-user';
import { User } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuardUser)
@Controller('recurring')
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Post('transaction/:id')
  async create(
    @Body() createRecurringDto: CreateRecurringDto,
    @I18n() i18n: I18nContext,
    @ParseId('id') id: number,
  ) {
    createRecurringDto.transaction_id = id;
    const recurring = await this.recurringService.create(
      createRecurringDto,
      i18n,
    );
    return {
      status: true,
      message: i18n.t('recurring.create_success'),
      data: recurring,
    };
  }

  @Get()
  async findAllByUser(@User() user) {
    const data = await this.recurringService.findAllByUser(+user.sub);
    return { data: data };
  }

  @Get(':id')
  async findAllByTransaction(@ParseId('id') id: number) {
    const data = await this.recurringService.findByTransaction(+id);
    return { data: data };
  }

  @Patch(':id')
  async update(
    @ParseId('id') id: number,
    @I18n() i18n: I18nContext,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    const recurring = await this.recurringService.update(+id, updateRecurringDto, i18n);
    return {
      status: true,
      message: i18n.t('recurring.update_success'),
      data: recurring
    }
  }

  @Delete(':id')
  async remove(@ParseId('id') id: number, @I18n() i18n: I18nContext) {
    const recurring = await this.recurringService.remove(+id, i18n);
    return {
      status: true,
      message: i18n.t('recurring.delete_success'),
      data: recurring
    }
  }
}
