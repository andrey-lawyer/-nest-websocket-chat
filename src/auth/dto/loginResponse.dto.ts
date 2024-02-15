import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: '1',
    description: 'Id of member.',
  })
  id: number;
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the registered member.',
  })
  name: string;
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email of the registered member.',
  })
  email: string;
  @ApiProperty({
    example: 'https://example.com',
    description: 'Website of member.',
  })
  homePage: string;
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL of the registered member.',
  })
  avatar: string;
  @ApiProperty({
    example: '3dd1234def3d3d3e3d33',
    description: 'Authentication token',
  })
  token: string;
}
