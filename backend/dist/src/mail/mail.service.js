"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    transporter;
    constructor(config) {
        this.config = config;
        const host = this.config.get('SMTP_HOST');
        const user = this.config.get('SMTP_USER');
        const pass = this.config.get('SMTP_PASSWORD');
        this.transporter = host && user && pass ? nodemailer.createTransport({
            host,
            port: Number(this.config.get('SMTP_PORT', 587)),
            secure: this.config.get('SMTP_SECURE', 'false') === 'true',
            auth: { user, pass },
        }) : null;
    }
    async sendVerificationEmail(email, names, verificationUrl) {
        if (!this.transporter) {
            this.logger.warn(`SMTP no configurado. Enlace de verificación para ${email}: ${verificationUrl}`);
            return;
        }
        const safeName = this.escapeHtml(names);
        await this.transporter.sendMail({
            from: this.config.get('MAIL_FROM', 'FinLex Group <no-reply@finlex.local>'),
            to: email,
            subject: 'Verifique su correo — FinLex Group',
            text: `Hola ${names}. Confirme su correo abriendo este enlace: ${verificationUrl}. El enlace vence en 24 horas.`,
            html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0a1628">
        <div style="border-top:4px solid #c9a96e;padding:32px;border-left:1px solid #e5e1d8;border-right:1px solid #e5e1d8;border-bottom:1px solid #e5e1d8">
          <h1 style="font-family:Georgia,serif;font-weight:400">Confirme su correo</h1>
          <p>Hola ${safeName}, gracias por registrarse en FinLex Group.</p>
          <p>Para activar su cuenta, confirme que este correo le pertenece:</p>
          <p style="margin:28px 0"><a href="${verificationUrl}" style="display:inline-block;padding:14px 22px;background:#0a1628;color:#fff;text-decoration:none;border:1px solid #c9a96e">VERIFICAR MI CORREO</a></p>
          <p style="font-size:12px;color:#6b7280">Este enlace vence en 24 horas. Si no creó esta cuenta, ignore este mensaje.</p>
        </div>
      </div>`,
        });
    }
    async sendPasswordResetEmail(email, names, resetUrl) {
        if (!this.transporter) {
            this.logger.warn(`SMTP no configurado. Enlace para cambiar la clave de ${email}: ${resetUrl}`);
            return;
        }
        const safeName = this.escapeHtml(names);
        await this.transporter.sendMail({
            from: this.config.get('MAIL_FROM', 'FinLex Group <no-reply@finlex.local>'),
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
    escapeHtml(value) {
        return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map