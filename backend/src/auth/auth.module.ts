import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UsersModule, MailModule, PassportModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({ secret: config.getOrThrow('JWT_SECRET'), signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '1h') } }),
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AuthModule {}
