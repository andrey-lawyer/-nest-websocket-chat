import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Member } from './member.entity';
import { IResponseMember } from './responseMember.type';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly userRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateSocketMember(
    authToken: string,
  ): Promise<IResponseMember | null> {
    try {
      const decodedToken = this.jwtService.verify(authToken);
      const userId = decodedToken.sub;
      const user = await this.userRepository.findOneOrFail({
        where: { id: userId },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid socket authentication token');
    }
  }
}
