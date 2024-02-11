import { NestFactory } from '@nestjs/core';

import * as session from 'express-session';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GoogleRecaptchaFilter } from './filter-error/captcha-error';

// import * as connectRedis from 'connect-redis';
// import { default as Redis } from 'ioredis';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  // const RedisStore = connectRedis(session);
  // const redisClient = new Redis();
  const app = await NestFactory.create(AppModule);
  //
  app.use(
    session({
      // store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: process.env.PRIVATE_KEY,
      resave: false,
    }),
  );

  app.enableCors({
    origin: [
      'https://react-socket-chat-zeta.vercel.app',
      'https://react-sockets.netlify.app',
      'https://reacy-sockets.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost',
      process.env.FRONT_URL,
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GoogleRecaptchaFilter());
  await app.listen(PORT, () => console.log('server listening on port ' + PORT));
}
bootstrap();
