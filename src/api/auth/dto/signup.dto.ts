import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'Unique username for the admin',
    example: 'admin_john',
  })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString({ message: 'Username should be a string' })
  username: string;

  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'Phone should not be empty' })
  @IsString({ message: 'Phone should be a string' })
  phone: string;

  @ApiProperty({
    description:
      'Password for the admin account (min 8 characters, must include uppercase, lowercase, number and special character)',
    example: 'SecurePass123!',
  })
  @IsString({ message: 'Password should be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;
}
