import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const moment = require('moment');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use(I18nMiddleware);
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 1000, // 1h
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,
      transform: true,
    }),
    new I18nValidationPipe(),
  );

  // Configure directory for static files (CSS, JS, images, ...)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Folder containing .hbs files
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Configure view engine handlebars + partials
  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      partialsDir: join(__dirname, '..', 'views/partials'),
      helpers: {
        inc: (value) => parseInt(value) + 1,
        eq: (a, b) => a === b,
        t: function (key, options) {
          const req = options.data.root.req;
          if (req && typeof req.t === 'function') {
            return req.t(key);
          }
          return key;
        },
        dash: (a, b) => `${a}-${b}`,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        dec: (value) => parseInt(value) - 1,
        range: function (start, end) {
          let result: number[] = [];
          for (let i = parseInt(start); i <= parseInt(end); i++) {
            result.push(i);
          }
          return result;
        },
        safe: (value) => value || '',
        formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
          return moment(date).format(format);
        },
        json: (context) => JSON.stringify(context),
        ifEquals: (arg1: any, arg2: any, options: any) => {
          return arg1 == arg2 ? options.fn(this) : options.inverse(this);
        },
      },
    }),
  );
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Personal Finance Management example')
    .setDescription('The personal Finance Management API description')
    .setVersion('1.0')
    .addTag('Personal Finance Management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
