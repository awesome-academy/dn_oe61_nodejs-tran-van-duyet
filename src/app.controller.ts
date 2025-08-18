import { Controller, Get, Logger, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  // @Get()
  // @Render('index')
  // getHello() {
  //   return { message: this.appService.getHello() };
  // }

  @Get()
  @Render('index')
  async getHelloMessage(@I18n() i18n: I18nContext) {
    const lang = i18n.lang;
    const message = await i18n.t('test.HELLO');
    return { lang, message, l: i18n.t('layout') };
  }
}
