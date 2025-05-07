import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @MinLength(3)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
