import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CaptchaModule } from 'src/captcha/captcha.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { LocalStrategy } from 'src/strategy/local.strategy';

import { LocalAuthGuard } from 'src/guards/local-auth.guard';

import { Member } from 'src/member/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    PassportModule,
    CaptchaModule,

    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.PRIVATE_KEY || 'secret_key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
