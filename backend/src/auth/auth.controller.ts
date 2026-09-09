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
import { TurnstileService } from './turnstile.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly config: ConfigService, private readonly turnstile: TurnstileService) {}

  @Public() @Get('turnstile-config') turnstileConfig() { return { siteKey: this.turnstile.siteKey() }; }
  @Public() @Post('register') async register(@Body() dto: RegisterDto) { await this.turnstile.verify(dto.captchaToken, 'register'); return this.authService.register(dto); }
  @Public() @Post('login') async login(@Body() dto: LoginDto) { await this.turnstile.verify(dto.captchaToken, 'login'); return this.authService.login(dto); }
  @Post('request-password-change') requestPasswordChange(@Req() request: Request & { user: AuthUser }) { return this.authService.requestPasswordChange(request.user.id); }
  @Public() @Post('forgot-password') async forgotPassword(@Body() dto: ForgotPasswordDto) { await this.turnstile.verify(dto.captchaToken, 'forgot-password'); return this.authService.forgotPassword(dto); }
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
