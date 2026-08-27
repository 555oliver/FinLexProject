CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  names varchar(150) NOT NULL,
  email varchar(180) NOT NULL UNIQUE,
  username varchar(80) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  phone varchar(30),
  country_code varchar(2),
  dial_code varchar(8),
  role user_role NOT NULL DEFAULT 'user',
  is_active boolean NOT NULL DEFAULT true,
  terms_accepted_at timestamptz,
  recovery_balance numeric(14,2) NOT NULL DEFAULT 0,
  recovered_funds numeric(14,2) NOT NULL DEFAULT 0,
  pending_fees numeric(14,2) NOT NULL DEFAULT 0,
  total_paid numeric(14,2) NOT NULL DEFAULT 0,
  active_payment_plan varchar(100) NOT NULL DEFAULT 'Pendiente',
  identity_document varchar(50),
  address varchar(255),
  fiscal_country varchar(100),
  email_verified_at timestamptz,
  verification_token_hash varchar(64),
  verification_token_expires_at timestamptz,
  password_reset_token_hash varchar(64),
  password_reset_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_verification_token_hash_idx ON users(verification_token_hash);
CREATE INDEX users_password_reset_token_hash_idx ON users(password_reset_token_hash);

CREATE TABLE user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_name varchar(255) NOT NULL,
  mime_type varchar(120) NOT NULL,
  size integer NOT NULL,
  data bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IDX_user_documents_user_id ON user_documents(user_id);

CREATE TABLE payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  concept varchar(80) NOT NULL DEFAULT 'Pago',
  amount numeric(14,2) NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'Pagado',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IDX_payment_history_user_id ON payment_history(user_id);

CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_type varchar(20) NOT NULL,
  cardholder_name varchar(150) NOT NULL,
  brand varchar(30) NOT NULL,
  last_four varchar(4) NOT NULL,
  expiry_month smallint NOT NULL,
  expiry_year smallint NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IDX_payment_methods_user_id ON payment_methods(user_id);

CREATE TABLE complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason varchar(120) NOT NULL,
  description text NOT NULL,
  status varchar(30) NOT NULL DEFAULT 'En revisión',
  attachment_name varchar(255),
  attachment_mime_type varchar(120),
  attachment_size integer,
  attachment_data bytea,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IDX_complaints_user_id ON complaints(user_id);

CREATE TABLE cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_number varchar(30) NOT NULL UNIQUE,
  current_phase smallint NOT NULL DEFAULT 0 CHECK (current_phase BETWEEN 0 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cases_user_id_idx ON cases(user_id);
