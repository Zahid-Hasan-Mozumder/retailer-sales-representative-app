import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'admin_john',
  })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString({ message: 'Username should be a string' })
  username: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'SecurePass123!',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password should be a string' })
  password: string;
}