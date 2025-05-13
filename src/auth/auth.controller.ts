import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
    return user;
  }
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User login successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isPasswordValid = await this.authService.validateUser(
      createUserDto.email,
      createUserDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.authService.login(user);
    res.cookie('token', token);
    return {
      user,
      token,
    };
  }
  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return {
      message: 'Logged out successfully',
    };
  }
}
