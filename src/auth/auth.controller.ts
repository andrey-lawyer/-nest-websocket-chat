import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as RequestNest,
  BadRequestException,
  Session,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, IRegisterResponse } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { CaptchaService } from 'src/captcha/captcha.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Body('captcha') enteredCaptcha: string,
    @Session() session: any,
  ): Promise<IRegisterResponse> {
    try {
      const data = await this.authService.create(
        registerDto,
        enteredCaptcha,
        session,
      );
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