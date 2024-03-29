import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { LocalStrategy } from 'src/auth/strategy/local.strategy';

import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

import { Member } from 'src/member/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    PassportModule,
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
