import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GoogleRecaptchaFilter } from './filter-error/captcha-error';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);

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
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest Socket Chat API')
    .setDescription('API documentation for Nest Socket Chat application.')
    .setVersion('1.0')
    .addTag(
      'Authentication',
      'Endpoints for user authentication and authorization.',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GoogleRecaptchaFilter());
  await app.listen(PORT, () => console.log('server listening on port ' + PORT));
}
bootstrap();
