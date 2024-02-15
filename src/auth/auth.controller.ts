import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as RequestNest,
  BadRequestException,
} from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'create new user' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  @ApiResponse({ status: 404, description: 'Bad Request' })
  @ApiBody({
    type: RegisterDto,
    description: 'Json structure for user object',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Google reCAPTCHA token',
    example: 'Bearer YOUR_RECAPTCHA_TOKEN_HERE',
  })
  @Recaptcha()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    try {
      const data = await this.authService.create(registerDto);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'authentication' })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @ApiResponse({ status: 404, description: 'Bad Request' })
  @ApiBody({
    type: LoginDto,
    description: 'Json structure for user object',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestNest() req: Request) {
    return this.authService.login(req.user);
  }
}
