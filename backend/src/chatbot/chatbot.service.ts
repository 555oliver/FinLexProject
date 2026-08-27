import { Injectable } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user.interface';

@Injectable()
export class ChatbotService {
  reply(user: AuthUser, rawMessage: string): { reply: string; createdAt: string } {
    const message = this.normalize(rawMessage);
    let reply: string;

    if (/\b(hola|buenos dias|buenas tardes|buenas)\b/.test(message)) {
      reply = `Hola, ${user.names}. Soy el asistente virtual de FinLex. Puedo orientarle sobre su caso, documentos, pagos y comunicación con su asesor.`;
    } else if (/document|archivo|imagen|comprobante|subir/.test(message)) {
      reply = 'Puede cargar imágenes, documentos Word o PDF desde Resumen, en “Recepción de documentación”. Cuando la carga finalice aparecerá en Actividad reciente con estado “Subido”.';
    } else if (/saldo|fondos|dinero|recuper|monto/.test(message)) {
      reply = 'Los valores de “Saldo en recuperación” y “Fondos recuperados” se muestran en su Resumen. Son actualizados por el equipo responsable conforme avanza la validación y recuperación de su caso.';
    } else if (/pago|cuota|honorario|factura/.test(message)) {
      reply = 'En la sección Pagos puede consultar honorarios, historial y planes disponibles. Si necesita una condición especial, solicite revisión con su asesor antes de efectuar el pago.';
    } else if (/estado|progreso|caso|fase/.test(message)) {
      reply = 'Puede revisar el estado y la línea de tiempo en “Mi caso”. Actualmente el portal muestra cada fase y los próximos pasos; los cambios oficiales serán actualizados por el equipo FinLex.';
    } else if (/asesor|cita|reunion|videollamada|humano/.test(message)) {
      reply = 'Para una revisión personalizada puede solicitar una cita o videollamada con su asesora. Este asistente ofrece orientación general y no reemplaza la evaluación profesional de su caso.';
    } else if (/gracias|perfecto|entendido/.test(message)) {
      reply = 'Con gusto. ¿Desea consultar sobre el estado de su caso, documentos, pagos o comunicarse con su asesora?';
    } else {
      reply = 'Puedo ayudarle con información sobre su caso, carga de documentos, fondos, pagos o contacto con su asesora. Cuénteme cuál de estos temas desea revisar.';
    }

    return { reply, createdAt: new Date().toISOString() };
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  }
}
