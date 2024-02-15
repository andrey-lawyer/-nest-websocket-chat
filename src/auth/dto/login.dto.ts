import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'exapmle@gmail.com',
    description: 'email',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'incorrect email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'password', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(4, 8, { message: 'min 4 letters, max - 8' })
  readonly password: string;
}
