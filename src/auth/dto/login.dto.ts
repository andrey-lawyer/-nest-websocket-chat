import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Exclude()
  @Length(4, 8, { message: 'min 4 letters, max - 8' })
  readonly password: string;
}
