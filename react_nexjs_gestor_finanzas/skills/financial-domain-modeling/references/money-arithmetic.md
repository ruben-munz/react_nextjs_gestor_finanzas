# Aritmética Monetaria Segura

- Almacena siempre los importes en unidades menores enteras (ej. 10,50 EUR = 1050 céntimos).
- Usa `Money.allocate(ratios)` para dividir importes en cuotas sin perder ni inventar céntimos.
- Nunca sumes ni restes instancias de `Money` de distinta divisa sin un tipo de cambio explícito.
