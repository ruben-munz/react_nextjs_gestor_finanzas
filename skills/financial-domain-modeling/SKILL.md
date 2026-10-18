---
name: financial-domain-modeling
description: Modela lógica financiera, cálculos monetarios, divisas, presupuestos, amortizaciones y balances. Úsala SIEMPRE que se escriba o modifique código que opere con dinero, porcentajes, impuestos, agregaciones de gastos/ingresos o entidades del dominio financiero.
---

# Financial Domain Modeling

Previene errores de coma flotante y protege las invariantes contables.

## Flujo de Trabajo
1. Prohibido operar dinero con decimales IEEE 754 directos. Usa `assets/MoneyValueObject.ts` trabajando en unidades menores enteras (céntimos).
2. Revisa `references/money-arithmetic.md` para conversiones ISO 4217 y reparto de céntimos (`allocate`).
3. Revisa `references/ledger-invariants.md` para transferencias entre cuentas, presupuestos y transacciones.
