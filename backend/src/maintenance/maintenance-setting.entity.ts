import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'maintenance_settings' })
export class MaintenanceSetting {
  @PrimaryColumn({ type: 'smallint', default: 1 }) id: number;
  @Column({ name: 'is_active', type: 'boolean', default: false }) isActive: boolean;
  @Column({ type: 'varchar', length: 120, default: 'Estamos mejorando para usted' }) title: string;
  @Column({ type: 'text', default: 'Realizamos labores de mantenimiento. Estaremos disponibles nuevamente muy pronto.' }) message: string;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
