import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { CaptchaService } from './captcha.service';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  async getCaptcha(
    @Res() res: Response,
    @Session() session: any,
  ): Promise<void> {
    const captcha = this.captchaService.generateCaptcha();
    session.captcha = captcha.text;
    res.type('svg').status(200).send(captcha.data);
  }
}
