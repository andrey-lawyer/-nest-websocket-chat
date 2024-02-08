import {
  IsNotEmpty,
  IsString,
  Length,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20, { message: 'min 4 letters, max - 20' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Invalid URL format' })
  homePage: string;

  @IsNotEmpty({ message: 'enteredCaptcha is required' })
  @IsString({ message: 'enteredCaptcha must be a string' })
  readonly captcha: string;
}
