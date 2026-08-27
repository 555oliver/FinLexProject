import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly users: UsersService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), ignoreExpiration: false, secretOrKey: config.getOrThrow('JWT_SECRET') });
  }
  async validate(payload: { sub: string }) {
    const user = await this.users.findById(payload.sub);
    return user ? { id: user.id, names: user.names, email: user.email, username: user.username, role: user.role } : null;
  }
}
