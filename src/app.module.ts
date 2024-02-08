import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { CaptchaModule } from './captcha/captcha.module';
import { CommentModule } from './comment/comment.module';

import { SocketService } from './socket/socket.service';
import { ErrorFilter } from './errors-filter/errors-filter';

import { Chat } from './chat/chat.entity';
import { Member } from './member/member.entity';
import { Comment } from './comment/comment.entity';

@Module({
  imports: [
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
      url: process.env.AWS_REGION
        ? `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@aws-0-${process.env.AWS_REGION}.pooler.supabase.com:6543/${process.env.POSTGRES_DB}?options=reference%3D${process.env.REFERENCE_ID}`
        : undefined,
    }),
    ChatModule,
    FilesModule,
    CloudinaryModule,
    AuthModule,
    CaptchaModule,
    CommentModule,
  ],
  providers: [
    SocketService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class AppModule {}
