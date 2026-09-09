import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnstileService {
  constructor(private readonly config: ConfigService) {}

  siteKey(): string {
    return this.config.get<string>('TURNSTILE_SITE_KEY') || '1x00000000000000000000AA';
  }

  async verify(token: string, expectedAction: string): Promise<void> {
    const hosted = this.config.get('NODE_ENV') === 'production' || this.config.get('NETLIFY') === 'true' || Boolean(this.config.get('CONTEXT'));
    const secret = this.config.get<string>('TURNSTILE_SECRET_KEY') ||
      (hosted ? '' : '1x0000000000000000000000000000000AA');
    if (!secret) throw new ServiceUnavailableException('La protección CAPTCHA no está configurada.');
    if (!token) throw new BadRequestException('Complete la verificación de seguridad.');
    const body = new URLSearchParams({ secret, response: token });
    let result: { success?: boolean; action?: string };
    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
      if (!response.ok) throw new Error(`Siteverify respondió ${response.status}`);
      result = await response.json() as { success?: boolean; action?: string };
    } catch {
      throw new ServiceUnavailableException('No fue posible completar la verificación de seguridad. Inténtelo nuevamente en unos minutos.');
    }
    if (!result.success || (result.action && result.action !== expectedAction)) {
      throw new BadRequestException('La verificación de seguridad venció o no es válida. Inténtelo nuevamente.');
    }
  }
}
