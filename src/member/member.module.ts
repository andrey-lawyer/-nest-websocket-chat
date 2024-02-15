import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.PRIVATE_KEY || 'secret_key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
