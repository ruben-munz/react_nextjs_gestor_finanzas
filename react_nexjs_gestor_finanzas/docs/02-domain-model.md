# 02. Modelo de Dominio y Esquema Entidad-Relación

## 1. Regla Monetaria e Invariantes Contables (`financial-domain-modeling`)
1. **Unidades menores enteras (`Money` VO)**: Todos los importes monetarios se almacenan en base de datos en céntimos enteros (`BIGINT`) junto con el código de divisa ISO 4217 (`EUR`) y se operan en memoria mediante el Value Object inmutable `Money`.
2. **Prohibición de importe cero**: Ninguna entidad `Transaction` puede instanciarse ni persistirse con `amount.minorUnits <= 0`.
3. **Presupuestos positivos**: Toda categoría con presupuesto mensual definido (`monthlyBudget`) exige un límite estrictamente mayor que `0` céntimos.
4. **Actualización atómica de saldos**: Al registrar un movimiento (`INCOME` o `EXPENSE`), la inserción en `transactions` y la actualización de `accounts.balance_cents` se ejecutan dentro de una misma transacción ACID en MySQL (`BEGIN` / `COMMIT` / `ROLLBACK`).

---

## 2. Diagrama de Clases del Dominio (`classDiagram`)

```mermaid
classDiagram
    class Money {
        -number amountInMinorUnits
        +CurrencyCode currency
        +fromMinorUnits(cents, currency)$ Money
        +fromDecimal(amount, currency)$ Money
        +add(other: Money) Money
        +subtract(other: Money) Money
        +allocate(ratios: number[]) Money[]
        +format(locale: string) string
    }

    class Account {
        +string id
        +string name
        +AccountType type
        +string bank
        +string accountNumber
        +string lastFourDigits
        +Money balance
        +credit(amount: Money) Account
        +debit(amount: Money) Account
    }

    class Category {
        +string id
        +string name
        +CategoryType type
        +string icon
        +Money monthlyBudget
    }

    class Transaction {
        +string id
        +string accountId
        +string categoryId
        +TransactionType type
        +Money amount
        +string concept
        +Date date
        +TransactionStatus status
    }

    class Investment {
        +string id
        +string name
        +string ticker
        +InvestmentAssetType type
        +number quantity
        +Money investedAmount
        +Money currentValue
        +Money netProfit
        +number roiPercentage
    }

    Account *-- Money
    Category *-- Money
    Transaction *-- Money
    Investment *-- Money
    Account "1" --> "*" Transaction : registra
    Category "1" --> "*" Transaction : clasifica
```

---

## 3. Esquema Entidad-Relación en MySQL 8.0 (`erDiagram`)

```mermaid
erDiagram
    ACCOUNTS ||--o{ TRANSACTIONS : "account_id"
    CATEGORIES ||--o{ TRANSACTIONS : "category_id"

    ACCOUNTS {
        varchar(36) id PK
        varchar(100) name
        enum type "CHECKING | SAVINGS | CASH"
        varchar(100) bank
        varchar(34) account_number "IBAN / Numero de cuenta"
        bigint balance_cents "Importe en centimos"
        char(3) currency "EUR"
        varchar(30) color
        varchar(50) icon
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        varchar(36) id PK
        varchar(100) name
        enum type "INCOME | EXPENSE"
        varchar(50) icon
        bigint monthly_budget_cents "Opcional > 0"
        char(3) currency "EUR"
        timestamp created_at
    }

    TRANSACTIONS {
        varchar(36) id PK
        varchar(36) account_id FK
        varchar(36) category_id FK
        enum type "INCOME | EXPENSE | TRANSFER"
        bigint amount_cents "Estrictamente > 0"
        char(3) currency "EUR"
        varchar(255) concept
        datetime transaction_date
        enum status "POSTED | VOID"
        timestamp created_at
    }

    INVESTMENTS {
        varchar(36) id PK
        varchar(120) name
        varchar(20) ticker
        enum type "STOCK | ETF | CRYPTO | REAL_ESTATE | BOND"
        decimal quantity "DECIMAL(18,8)"
        bigint invested_amount_cents
        bigint current_value_cents
        char(3) currency "EUR"
        datetime updated_at
    }
```
