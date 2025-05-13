import { IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'John snow' })
  name: string;

  @MinLength(3)
  @IsEmail()
  @ApiProperty({ example: 'johnsnow427@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'strongPassword' })
  password: string;
}
