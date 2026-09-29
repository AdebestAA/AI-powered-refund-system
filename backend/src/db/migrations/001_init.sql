-- 001_init: all tables for the app.
-- Postgres 13+ (gen_random_uuid() is built in).

-- ─── Users ────────────────────────────────────────────────────────────────
-- Everyone who can log in. Customers (role = 'customer') are also the mock CRM
-- profiles: their orders live in `orders`.
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  email             TEXT        NOT NULL UNIQUE,            -- always stored lowercase
  password_hash     TEXT        NOT NULL,
  role              TEXT        NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  email_verified_at TIMESTAMPTZ,
  phone             TEXT,
  is_flagged        BOOLEAN     NOT NULL DEFAULT false,     -- e.g. open chargeback → refunds get escalated
  flag_reason       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()      -- also "customer since"
);

-- 6-digit email verification codes (stored encrypted).
CREATE TABLE email_otps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_encrypted  TEXT        NOT NULL,
  attempts        INTEGER     NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per refresh token. A new row is added on every refresh; the old one is
-- marked revoked. family_id = which login the token came from.
CREATE TABLE refresh_tokens (
  id                UUID PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id         UUID        NOT NULL,
  secret_encrypted  TEXT        NOT NULL,
  expires_at        TIMESTAMPTZ NOT NULL,
  revoked_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Orders (mock CRM) ────────────────────────────────────────────────────
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number  TEXT          NOT NULL UNIQUE,
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT          NOT NULL CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  total         NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  placed_at     TIMESTAMPTZ   NOT NULL,
  delivered_at  TIMESTAMPTZ
);

CREATE TABLE order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku            TEXT          NOT NULL,
  product_name   TEXT          NOT NULL,
  category       TEXT          NOT NULL,
  unit_price     NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity       INTEGER       NOT NULL CHECK (quantity > 0),
  is_final_sale  BOOLEAN       NOT NULL DEFAULT false
);

-- One row per refund request 
CREATE TABLE refund_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id            UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  message             TEXT          NOT NULL,              -- what the customer wrote

  -- What the AI extracted from the message
  ai_category         TEXT          CHECK (ai_category IN ('damaged', 'wrong_item', 'not_received', 'changed_mind', 'other')),
  ai_summary          TEXT,
  ai_flag             TEXT,                                -- why it looks suspicious/conflicting (NULL = nothing)
  injection_detected  BOOLEAN       NOT NULL DEFAULT false,

  -- What the policy rules decided
  status              TEXT          NOT NULL CHECK (status IN ('approved', 'denied', 'escalated')),
  decision_reason     TEXT          NOT NULL,              -- the rule that decided it
  refund_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  reply               TEXT          NOT NULL,              -- message shown to the customer

  -- Admin review (only for escalated requests)
  admin_note          TEXT,
  reviewed_by         UUID          REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ,

  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);
