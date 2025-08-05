import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}
  getHello(): string {
    return 'Welcome to My NestJS App';
  }

  getHelloMessage(): string {
    const lang = I18nContext.current()?.lang || 'vi'; // fallback to 'vi'
    return this.i18n.t('test.HELLO', { lang });
  }
}
