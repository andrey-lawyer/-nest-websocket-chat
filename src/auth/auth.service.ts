import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';

import { Member } from 'src/member/member.entity';
import axios from 'axios';
import {
  IRegisterResponse,
  IResponseMember,
  ITokenUser,
} from 'src/types/response.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly userRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async create(registerDto: RegisterDto): Promise<IRegisterResponse> {
    const user = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const avatar = await this.generateAvatar(registerDto.name);
    const newUser = this.userRepository.create({
      ...registerDto,
      avatar,
      password: await bcrypt.hash(registerDto.password, 10),
    });

    const { email, name } = await this.userRepository.save(newUser);

    return {
      message: 'Member successfully registered',
      member: { email, name, avatar },
    };
  }

  async login(user: any): Promise<ITokenUser | null> {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    userWithoutPassword.token = accessToken;

    return userWithoutPassword;
  }

  // for local(login) strategy
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async authenticateSocketUser(
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

  generateAvatar = async (name: string): Promise<string> => {
    const url = `https://api.multiavatar.com/${name}?apikey=${process.env.API_KEY_AVATAR}`;
    const response = await axios.get(url);

    return response.data;
  };
}
