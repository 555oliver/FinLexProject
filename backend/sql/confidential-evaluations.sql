-- Ejecute este script una sola vez en la consola SQL de la base de datos de producción de Netlify.
CREATE TABLE IF NOT EXISTS confidential_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'Solicitada',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS IDX_confidential_evaluations_email
  ON confidential_evaluations (email);

CREATE UNIQUE INDEX IF NOT EXISTS UQ_confidential_evaluations_active_email
  ON confidential_evaluations (lower(email))
  WHERE status IN ('Solicitada', 'En revisión', 'Contactada', 'Aprobada');
