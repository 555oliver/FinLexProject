CREATE TABLE IF NOT EXISTS maintenance_settings (
  id smallint PRIMARY KEY DEFAULT 1,
  is_active boolean NOT NULL DEFAULT false,
  title varchar(120) NOT NULL DEFAULT 'Estamos mejorando para usted',
  message text NOT NULL DEFAULT 'Realizamos labores de mantenimiento. Estaremos disponibles nuevamente muy pronto.',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT maintenance_settings_singleton CHECK (id = 1)
);

INSERT INTO maintenance_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
