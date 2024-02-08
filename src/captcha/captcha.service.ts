import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  generateCaptcha(): { data: string; text: string } {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 3,
      color: true,
      background: '#f0f0f0',
    });

    return { data: captcha.data, text: captcha.text };
  }

  validateCaptcha(enteredCaptcha: string, storedCaptcha: string): boolean {
    return enteredCaptcha === storedCaptcha;
  }
}
