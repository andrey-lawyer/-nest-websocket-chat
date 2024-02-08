import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  // app.enableCors({
  //   origin: process.env.FRONT_URL || 'http://localhost:5173',
  //   credentials: true,
  // });
  // app.enableCors({
  //   origin: [
  //     'https://react-socket-chat-zeta.vercel.app',
  //     'http://localhost:5173',
  //     'http://localhost:5174',
  //     'http://localhost:5175',
  //     process.env.FRONT_URL,
  //   ],
  //   // credentials: true,
  //   credentials: process.env.FRONT_URL.includes('localhost') ? true : false,
  // });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => console.log('server listening on port ' + PORT));
}
bootstrap();
