import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from './auth-user.interface';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: ConfigService) {}

  @Public() @Post('register') register(@Body() dto: RegisterDto) { return this.authService.register(dto); }
  @Public() @Post('login') login(@Body() dto: LoginDto) { return this.authService.login(dto); }
  @Post('request-password-change') requestPasswordChange(@Req() request: Request & { user: AuthUser }) { return this.authService.requestPasswordChange(request.user.id); }
  @Public() @Post('forgot-password') forgotPassword(@Body() dto: ForgotPasswordDto) { return this.authService.forgotPassword(dto); }
  @Public() @Post('reset-password') resetPassword(@Body() dto: ResetPasswordDto) { return this.authService.resetPassword(dto); }
  @Public() @Get('verify-email') async verifyEmail(@Query('token') token: string, @Res() response: Response) {
    const frontendUrl = this.config.get('FRONTEND_URL') ?? this.config.get('URL', 'http://localhost:4200');
    try {
      await this.authService.verifyEmail(token);
      return response.redirect(`${frontendUrl}/portal/login?verification=success`);
    } catch {
      return response.redirect(`${frontendUrl}/portal/login?verification=invalid`);
    }
  }
  @Get('me') me(@Req() request: Request & { user: AuthUser }) { return request.user; }
}
