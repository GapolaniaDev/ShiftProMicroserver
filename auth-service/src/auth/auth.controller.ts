import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('validate')
  async validateToken(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}