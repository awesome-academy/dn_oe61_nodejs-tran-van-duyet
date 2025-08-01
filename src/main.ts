import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import { I18nMiddleware } from 'nestjs-i18n';


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
      },
    }),
  );
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
