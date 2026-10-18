---
name: incremental-dev-docs
description: Genera y actualiza de forma incremental la documentación técnica para desarrolladores dentro de la carpeta /docs. Úsala SIEMPRE que se proponga una nueva funcionalidad, se modifique la arquitectura, se cambie el modelo de datos o se implemente un nuevo caso de uso.
---

# Incremental Developer Documentation (/docs)

Mantiene viva e incremental la documentación técnica en `/docs`.

## Flujo de Trabajo
1. Inspecciona los archivos existentes en `/docs` antes de editar para no borrar el contexto histórico.
2. Usa `assets/feature-spec.template.md` para documentar módulos en `docs/features/<feature>.md`.
3. Usa `assets/adr.template.md` para decisiones arquitectónicas en `docs/adr/`.
4. Incluye diagramas Mermaid siguiendo `references/mermaid-conventions.md`.
