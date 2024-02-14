import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as RequestNest,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Recaptcha } from '@nestlab/google-recaptcha';

import { IRegisterResponse } from './../types/response.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Recaptcha()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<IRegisterResponse> {
    try {
      const data = await this.authService.create(registerDto);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestNest() req: Request) {
    return this.authService.login(req.user);
  }
}
