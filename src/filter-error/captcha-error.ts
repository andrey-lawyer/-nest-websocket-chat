import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GoogleRecaptchaException } from '@nestlab/google-recaptcha';
import { Response } from 'express';

@Catch(GoogleRecaptchaException)
export class GoogleRecaptchaFilter implements ExceptionFilter {
  catch(exception: GoogleRecaptchaException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const captchaError = exception.getResponse();
    response.status(400).json({
      statusCode: 400,
      message: 'Captcha verification failed',
      error: captchaError,
    });
  }
}
