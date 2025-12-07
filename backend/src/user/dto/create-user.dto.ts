import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'example@example.com',
    description: 'The email of the user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'example123',
    description: 'The password of the user',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  password: string;
}
