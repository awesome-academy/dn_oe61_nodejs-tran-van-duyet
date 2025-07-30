import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
    }),
  );
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
