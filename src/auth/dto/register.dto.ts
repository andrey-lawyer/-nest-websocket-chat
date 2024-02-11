import { IsNotEmpty, IsString, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 20, { message: 'min 4 letters, max - 20' })
  readonly name: string;

  homePage?: string;
}
