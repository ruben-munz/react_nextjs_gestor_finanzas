-- =============================================================================
-- Datos Semilla (Database Seeding) - Últimos 6 meses
-- Importes expresados en céntimos enteros (ej. 485050 = 4.850,50 EUR)
-- =============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DELETE FROM transactions;
DELETE FROM investments;
DELETE FROM categories;
DELETE FROM accounts;

-- 1. CUENTAS BANCARIAS Y EFECTIVO (3 Cuentas)
INSERT INTO accounts (id, name, type, bank, balance_cents, currency, color, icon) VALUES
  ('acc-nomina-01', 'Cuenta Nómina Principal', 'CHECKING', 'BBVA', 485050, 'EUR', '#2563eb', 'Landmark'),
  ('acc-ahorro-02', 'Cuenta Ahorro Remunerada', 'SAVINGS', 'MyInvestor', 1520000, 'EUR', '#10b981', 'PiggyBank'),
  ('acc-efectivo-03', 'Efectivo y Tarjeta Prepago', 'CASH', 'Revolut / Efectivo', 32075, 'EUR', '#8b5cf6', 'Wallet');

-- 2. CATEGORÍAS DE INGRESOS Y GASTOS (10 Categorías)
INSERT INTO categories (id, name, type, icon, monthly_budget_cents, currency) VALUES
  ('cat-nomina', 'Nómina', 'INCOME', 'Briefcase', NULL, 'EUR'),
  ('cat-freelance', 'Freelance', 'INCOME', 'Laptop', NULL, 'EUR'),
  ('cat-dividendos', 'Dividendos', 'INCOME', 'TrendingUp', NULL, 'EUR'),
  ('cat-vivienda', 'Alquiler/Hipoteca', 'EXPENSE', 'Home', 95000, 'EUR'),
  ('cat-supermercado', 'Supermercado', 'EXPENSE', 'ShoppingCart', 42000, 'EUR'),
  ('cat-restaurantes', 'Restaurantes', 'EXPENSE', 'Utensils', 22000, 'EUR'),
  ('cat-suministros', 'Suministros', 'EXPENSE', 'Zap', 16000, 'EUR'),
  ('cat-transporte', 'Transporte', 'EXPENSE', 'Car', 14000, 'EUR'),
  ('cat-ocio', 'Ocio', 'EXPENSE', 'Film', 15000, 'EUR'),
  ('cat-suscripciones', 'Suscripciones', 'EXPENSE', 'CreditCard', 6500, 'EUR');

-- 3. MOVIMIENTOS FINANCIEROS (34 Movimientos en los últimos 6 meses)
INSERT INTO transactions (id, account_id, category_id, type, amount_cents, currency, concept, transaction_date, status) VALUES
  -- Hace 5 meses
  ('tx-m5-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 285000, 'EUR', 'Nómina Mensual Tech Solutions SL', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), INTERVAL 5 MONTH), 'POSTED'),
  ('tx-m5-02', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-03 10:15:00'), INTERVAL 5 MONTH), 'POSTED'),
  ('tx-m5-03', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 34520, 'EUR', 'Compra mensual Mercadona y Carrefour', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-08 18:30:00'), INTERVAL 5 MONTH), 'POSTED'),
  ('tx-m5-04', 'acc-nomina-01', 'cat-suministros', 'EXPENSE', 13840, 'EUR', 'Factura Luz Iberdrola y Fibra Digi', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-12 11:00:00'), INTERVAL 5 MONTH), 'POSTED'),
  ('tx-m5-05', 'acc-efectivo-03', 'cat-restaurantes', 'EXPENSE', 14250, 'EUR', 'Cenas fin de semana y cafetería', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-18 21:45:00'), INTERVAL 5 MONTH), 'POSTED'),

  -- Hace 4 meses
  ('tx-m4-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 285000, 'EUR', 'Nómina Mensual Tech Solutions SL', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), INTERVAL 4 MONTH), 'POSTED'),
  ('tx-m4-02', 'acc-ahorro-02', 'cat-freelance', 'INCOME', 65000, 'EUR', 'Consultoría Arquitectura Cloud', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-05 14:20:00'), INTERVAL 4 MONTH), 'POSTED'),
  ('tx-m4-03', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-03 10:00:00'), INTERVAL 4 MONTH), 'POSTED'),
  ('tx-m4-04', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 36890, 'EUR', 'Supermercado Mercadona y mercado local', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-10 19:10:00'), INTERVAL 4 MONTH), 'POSTED'),
  ('tx-m4-05', 'acc-nomina-01', 'cat-transporte', 'EXPENSE', 9800, 'EUR', 'Combustible Repsol y abono transporte', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-15 16:00:00'), INTERVAL 4 MONTH), 'POSTED'),
  ('tx-m4-06', 'acc-efectivo-03', 'cat-ocio', 'EXPENSE', 11500, 'EUR', 'Entradas concierto y cine', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-22 20:00:00'), INTERVAL 4 MONTH), 'POSTED'),

  -- Hace 3 meses
  ('tx-m3-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 285000, 'EUR', 'Nómina Mensual Tech Solutions SL', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), INTERVAL 3 MONTH), 'POSTED'),
  ('tx-m3-02', 'acc-ahorro-02', 'cat-dividendos', 'INCOME', 18450, 'EUR', 'Abono Dividendos ETF Vanguard S&P 500', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-06 12:00:00'), INTERVAL 3 MONTH), 'POSTED'),
  ('tx-m3-03', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-03 10:00:00'), INTERVAL 3 MONTH), 'POSTED'),
  ('tx-m3-04', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 35120, 'EUR', 'Compra quincenal supermercado', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-09 18:15:00'), INTERVAL 3 MONTH), 'POSTED'),
  ('tx-m3-05', 'acc-nomina-01', 'cat-suministros', 'EXPENSE', 14950, 'EUR', 'Suministros electricidad, agua y fibra', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-14 09:30:00'), INTERVAL 3 MONTH), 'POSTED'),
  ('tx-m3-06', 'acc-efectivo-03', 'cat-restaurantes', 'EXPENSE', 17600, 'EUR', 'Restaurante japonés y comidas trabajo', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-20 15:00:00'), INTERVAL 3 MONTH), 'POSTED'),

  -- Hace 2 meses
  ('tx-m2-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 285000, 'EUR', 'Nómina Mensual Tech Solutions SL', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), INTERVAL 2 MONTH), 'POSTED'),
  ('tx-m2-02', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-03 10:00:00'), INTERVAL 2 MONTH), 'POSTED'),
  ('tx-m2-03', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 38240, 'EUR', 'Compra mensual Mercadona', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-07 17:40:00'), INTERVAL 2 MONTH), 'POSTED'),
  ('tx-m2-04', 'acc-nomina-01', 'cat-transporte', 'EXPENSE', 11200, 'EUR', 'Billetes AVE y gasolina', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-13 08:45:00'), INTERVAL 2 MONTH), 'POSTED'),
  ('tx-m2-05', 'acc-nomina-01', 'cat-suscripciones', 'EXPENSE', 4890, 'EUR', 'Spotify, Netflix, GitHub Copilot y iCloud', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-16 07:00:00'), INTERVAL 2 MONTH), 'POSTED'),

  -- Mes pasado (Hace 1 mes)
  ('tx-m1-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 295000, 'EUR', 'Nómina Mensual Tech Solutions SL (Revisión)', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), INTERVAL 1 MONTH), 'POSTED'),
  ('tx-m1-02', 'acc-ahorro-02', 'cat-freelance', 'INCOME', 48000, 'EUR', 'Auditoría Frontend Next.js Cliente', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-11 16:30:00'), INTERVAL 1 MONTH), 'POSTED'),
  ('tx-m1-03', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-03 10:00:00'), INTERVAL 1 MONTH), 'POSTED'),
  ('tx-m1-04', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 35900, 'EUR', 'Compra mensual Mercadona y Lidl', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-09 19:00:00'), INTERVAL 1 MONTH), 'POSTED'),
  ('tx-m1-05', 'acc-nomina-01', 'cat-suministros', 'EXPENSE', 13200, 'EUR', 'Electricidad, Gas y Fibra Óptica', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-14 10:00:00'), INTERVAL 1 MONTH), 'POSTED'),
  ('tx-m1-06', 'acc-efectivo-03', 'cat-restaurantes', 'EXPENSE', 15400, 'EUR', 'Cena aniversario y tapeo fin de semana', DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-21 22:15:00'), INTERVAL 1 MONTH), 'POSTED'),

  -- Mes actual (en curso)
  ('tx-m0-01', 'acc-nomina-01', 'cat-nomina', 'INCOME', 295000, 'EUR', 'Nómina Mensual Tech Solutions SL', DATE_FORMAT(NOW(), '%Y-%m-01 09:00:00'), 'POSTED'),
  ('tx-m0-02', 'acc-ahorro-02', 'cat-dividendos', 'INCOME', 21500, 'EUR', 'Intereses Cuenta Remunerada + Dividendos ETF', DATE_FORMAT(NOW(), '%Y-%m-02 11:30:00'), 'POSTED'),
  ('tx-m0-03', 'acc-nomina-01', 'cat-vivienda', 'EXPENSE', 92000, 'EUR', 'Recibo Alquiler Vivienda Habitual', DATE_FORMAT(NOW(), '%Y-%m-03 10:00:00'), 'POSTED'),
  ('tx-m0-04', 'acc-nomina-01', 'cat-supermercado', 'EXPENSE', 28450, 'EUR', 'Compra supermercado Mercadona', DATE_FORMAT(NOW(), '%Y-%m-05 18:20:00'), 'POSTED'),
  ('tx-m0-05', 'acc-nomina-01', 'cat-suministros', 'EXPENSE', 12980, 'EUR', 'Factura Luz Iberdrola y Fibra', DATE_FORMAT(NOW(), '%Y-%m-07 09:15:00'), 'POSTED'),
  ('tx-m0-06', 'acc-efectivo-03', 'cat-restaurantes', 'EXPENSE', 8640, 'EUR', 'Comida menú ejecutivo y brunch domingo', DATE_FORMAT(NOW(), '%Y-%m-09 14:45:00'), 'POSTED'),
  ('tx-m0-07', 'acc-nomina-01', 'cat-transporte', 'EXPENSE', 7450, 'EUR', 'Repostaje gasolina y parking centro', DATE_FORMAT(NOW(), '%Y-%m-11 17:10:00'), 'POSTED'),
  ('tx-m0-08', 'acc-efectivo-03', 'cat-ocio', 'EXPENSE', 6200, 'EUR', ' Teatro y escapada fin de semana', DATE_FORMAT(NOW(), '%Y-%m-13 20:30:00'), 'POSTED'),
  ('tx-m0-09', 'acc-nomina-01', 'cat-suscripciones', 'EXPENSE', 4890, 'EUR', 'Suscripciones digitales (Netflix, Spotify, Cloud)', DATE_FORMAT(NOW(), '%Y-%m-15 08:00:00'), 'POSTED');

-- 4. CARTERA DE INVERSIONES (5 Activos representativos)
INSERT INTO investments (id, name, ticker, type, quantity, invested_amount_cents, current_value_cents, currency, updated_at) VALUES
  ('inv-etf-sp500', 'Vanguard S&P 500 UCITS ETF', 'VUSA', 'ETF', 82.50000000, 650000, 784050, 'EUR', NOW()),
  ('inv-etf-msci', 'iShares Core MSCI World UCITS ETF', 'IWDA', 'ETF', 64.00000000, 500000, 579000, 'EUR', NOW()),
  ('inv-stock-msft', 'Microsoft Corporation', 'MSFT', 'STOCK', 7.25000000, 240000, 276520, 'EUR', NOW()),
  ('inv-crypto-btc', 'Bitcoin', 'BTC', 'CRYPTO', 0.03850000, 180000, 231080, 'EUR', NOW()),
  ('inv-bond-tesoro', 'Letras del Tesoro España 12M', 'ES-LETRA', 'BOND', 3.00000000, 300000, 310500, 'EUR', NOW());
