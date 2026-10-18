-- =============================================================================
-- Esquema de Base de Datos: Gestor de Finanzas Personales e Inversiones
-- Regla de Dominio (financial-domain-modeling):
-- Todos los importes monetarios se almacenan en céntimos enteros (BIGINT)
-- acompañados de su divisa ISO 4217 ('EUR') para evitar errores IEEE 754.
-- =============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('CHECKING', 'SAVINGS', 'CASH') NOT NULL,
  bank VARCHAR(100) NOT NULL,
  account_number VARCHAR(34) NOT NULL DEFAULT 'ES0000000000000000000000',
  balance_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  color VARCHAR(30) NOT NULL DEFAULT '#2563eb',
  icon VARCHAR(50) NOT NULL DEFAULT 'Landmark',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Tag',
  monthly_budget_cents BIGINT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_budget_positive CHECK (monthly_budget_cents IS NULL OR monthly_budget_cents > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  account_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  type ENUM('INCOME', 'EXPENSE', 'TRANSFER') NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  concept VARCHAR(255) NOT NULL,
  transaction_date DATETIME NOT NULL,
  status ENUM('POSTED', 'VOID') NOT NULL DEFAULT 'POSTED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT chk_amount_nonzero CHECK (amount_cents > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_type ON transactions(type);

CREATE TABLE IF NOT EXISTS investments (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  ticker VARCHAR(20) NOT NULL,
  type ENUM('STOCK', 'ETF', 'CRYPTO', 'REAL_ESTATE', 'BOND') NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL,
  invested_amount_cents BIGINT NOT NULL,
  current_value_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_investment_quantity CHECK (quantity > 0),
  CONSTRAINT chk_invested_amount CHECK (invested_amount_cents > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
