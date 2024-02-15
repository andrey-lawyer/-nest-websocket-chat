import { ApiProperty } from '@nestjs/swagger';

class MemberResponse {
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
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL of the registered member.',
  })
  avatar: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'success', description: 'message' })
  message: string;

  @ApiProperty({
    type: MemberResponse,
    description: 'Details of the registered member.',
  })
  member: MemberResponse;
}
