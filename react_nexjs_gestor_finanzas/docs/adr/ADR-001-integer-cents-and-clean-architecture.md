# ADR-001: Almacenamiento Monetario en Céntimos Enteros y Persistencia MySQL 8.0

* **Estado:** Aceptado
* **Fecha:** 2026-10-18

## Contexto
En aplicaciones de gestión financiera y carteras de inversión, el uso de tipos en coma flotante (`FLOAT`, `DOUBLE` o `number` decimal IEEE 754 directo en JavaScript) provoca errores de redondeo acumulativos (como `0.1 + 0.2 = 0.30000000000000004`). Asimismo, necesitamos que la capa de dominio y casos de uso permanezca desacoplada del motor de base de datos y del framework web (Next.js App Router).

## Opciones Consideradas
1. **Decimales en coma flotante en JS + `DECIMAL(10,2)` en SQL**: Sencillo inicialmente, pero propenso a errores de redondeo al agregar flujos de caja o repartir presupuestos en memoria.
2. **Enteros en unidades menores (`BIGINT` en céntimos en MySQL + Value Object `Money` en TypeScript)**: Almacena `485050` para representar `4.850,50 EUR`, operando exclusivamente con enteros seguros (`Number.isSafeInteger`) en toda la capa de dominio y aplicación.

## Decisión
Adoptamos la **Opción 2**:
- Todos los importes monetarios en MySQL (`accounts.balance_cents`, `categories.monthly_budget_cents`, `transactions.amount_cents`, `investments.invested_amount_cents`, `investments.current_value_cents`) se definen como `BIGINT NOT NULL` junto con `currency CHAR(3) DEFAULT 'EUR'`.
- Toda operación aritmética en `src/domain/` y `src/application/` utiliza el Value Object inmutable `Money`.
- Se utiliza `mysql2/promise` con transacciones explícitas (`BEGIN / COMMIT / ROLLBACK`) en `MySqlTransactionRepository` para garantizar que cada movimiento actualice el saldo de su cuenta de forma atómica.

## Consecuencias
- **Positivas**: Cero errores de coma flotante, invariantes contables garantizadas por construcción, tests unitarios deterministas y arranque inmediato con Docker Compose.
- **Consideraciones**: Las Server Actions convierten la entrada decimal del usuario a céntimos enteros en la frontera de presentación mediante `Money.fromDecimal(amount, 'EUR')`.
