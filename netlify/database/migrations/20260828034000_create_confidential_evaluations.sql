CREATE TABLE IF NOT EXISTS confidential_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'Solicitada',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_confidential_evaluations_email
  ON confidential_evaluations (email);

CREATE UNIQUE INDEX IF NOT EXISTS uq_confidential_evaluations_active_email
  ON confidential_evaluations (lower(email))
  WHERE status IN ('Solicitada', 'En revisión', 'Contactada', 'Aprobada');
