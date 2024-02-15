import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { LoginDto } from './login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'John', description: 'name', required: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 20, { message: 'min 4 letters, max - 20' })
  readonly name: string;

  @ApiProperty({
    example: 'https://nestjs.com',
    description: 'home page',
    required: false,
  })
  @IsOptional()
  homePage: string;
}
