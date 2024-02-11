import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';

import { SocketService } from './socket/socket.service';

import { Chat } from './chat/chat.entity';
import { Member } from './member/member.entity';
import { Comment } from './comment/comment.entity';

@Module({
  imports: [
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretKey: configService.get<string>('CAPTCHA_KEY'),
        response: (req) => req.headers.recaptcha,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local'],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT_DB,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [Chat, Member, Comment],
      synchronize: true,
    }),
    ChatModule,
    FilesModule,
    CloudinaryModule,
    AuthModule,
    CommentModule,
  ],
  providers: [SocketService],
})
export class AppModule {}
