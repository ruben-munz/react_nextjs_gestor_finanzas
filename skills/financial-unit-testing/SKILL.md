---
name: financial-unit-testing
description: Crea tests unitarios y de integración para el dominio financiero y casos de uso desacoplados de Next.js. Úsala cuando se creen nuevas entidades, Value Objects, calculadoras financieras o casos de uso en las capas domain y application.
---

# Financial Unit Testing

Crea suites de tests rápidas y deterministas para `domain` y `application`.

## Flujo de Trabajo
1. Revisa `references/edge-cases-checklist.md` para cubrir redondeos, céntimos impares y divisas.
2. Usa `assets/InMemoryRepo.template.ts` para testear Casos de Uso sin acoplarlos a la base de datos.
