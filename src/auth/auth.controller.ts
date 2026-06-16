import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto, @Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async registrar(@Body() dados: RegisterAuthDto) {
    return this.authService.registrar(dados);
  }
}
