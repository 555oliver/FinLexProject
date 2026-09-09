import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');
    this.transporter = host && user && pass ? nodemailer.createTransport({
      host,
      port: Number(this.config.get('SMTP_PORT', 587)),
      secure: this.config.get('SMTP_SECURE', 'false') === 'true',
      auth: { user, pass },
    }) : null;
  }

  async sendVerificationEmail(email: string, names: string, verificationUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`SMTP no configurado. Enlace de verificación para ${email}: ${verificationUrl}`);
      return;
    }
    const safeName = this.escapeHtml(names);
    try {
      await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM', 'FinLex Group <soporte@finlex.group.com>'),
      to: email,
      subject: 'Verifique su correo — FinLex Group',
      text: `Hola ${names}. Confirme su correo abriendo este enlace: ${verificationUrl}. El enlace vence en 24 horas.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0a1628">
        <div style="height:4px;background:#c9a96e;font-size:0;line-height:0">&nbsp;</div>
        <div style="padding:18px 32px;background:#0a1628">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle">
                <div style="width:42px;height:42px;border:1px solid #c9a96e;border-radius:50%;color:#c9a96e;font:20px/42px Georgia,serif;text-align:center">F</div>
              </td>
              <td style="padding-left:14px;vertical-align:middle">
                <div style="color:#ffffff;font:600 24px/25px Georgia,serif;letter-spacing:1px">FinLex</div>
                <div style="padding-top:3px;color:#c9a96e;font:700 8px/10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase">Group</div>
              </td>
            </tr>
          </table>
        </div>
        <div style="padding:32px;border-left:1px solid #e5e1d8;border-right:1px solid #e5e1d8;border-bottom:1px solid #e5e1d8">
          <h1 style="font-family:Georgia,serif;font-weight:400">Confirme su correo</h1>
          <p>Hola ${safeName}, gracias por registrarse en FinLex Group.</p>
          <p>Para activar su cuenta, confirme que este correo le pertenece:</p>
          <p style="margin:28px 0"><a href="${verificationUrl}" style="display:inline-block;padding:14px 22px;background:#0a1628;color:#fff;text-decoration:none;border:1px solid #c9a96e">VERIFICAR MI CORREO</a></p>
          <p style="font-size:12px;color:#6b7280">Este enlace vence en 24 horas. Si no creó esta cuenta, ignore este mensaje.</p>
        </div>
      </div>`,
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      this.logger.error(`No fue posible enviar el correo de verificación: ${detail}`);
      throw new ServiceUnavailableException('La cuenta fue creada, pero no pudimos enviar el correo de verificación. Verifique que el remitente SMTP esté autorizado e inténtelo más tarde.');
    }
  }

  async sendPasswordResetEmail(email: string, names: string, resetUrl: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`SMTP no configurado. Enlace para cambiar la clave de ${email}: ${resetUrl}`);
      return;
    }
    const safeName = this.escapeHtml(names);
    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM', 'FinLex Group <soporte@finlex.group.com>'),
      to: email,
      subject: 'Cambie su clave — FinLex Group',
      text: `Hola ${names}. Abra este enlace para crear una nueva clave: ${resetUrl}. El enlace vence en una hora.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0a1628">
        <div style="border-top:4px solid #c9a96e;padding:32px;border:1px solid #e5e1d8;border-top-width:4px">
          <h1 style="font-family:Georgia,serif;font-weight:400">Cambie su clave</h1>
          <p>Hola ${safeName}, recibimos una solicitud para actualizar la clave de su cuenta.</p>
          <p style="margin:28px 0"><a href="${resetUrl}" style="display:inline-block;padding:14px 22px;background:#0a1628;color:#fff;text-decoration:none;border:1px solid #c9a96e">CREAR NUEVA CLAVE</a></p>
          <p style="font-size:12px;color:#6b7280">El enlace vence en una hora y solo puede utilizarse una vez. Si no hizo esta solicitud, ignore el mensaje.</p>
        </div>
      </div>`,
    });
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
  }
}
