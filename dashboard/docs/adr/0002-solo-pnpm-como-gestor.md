# ADR 0002 · Solo pnpm como gestor de paquetes

- **Estado:** Aceptada
- **Fecha:** 2026-10-05

## Contexto

Las reglas del proyecto exigen pnpm, y `.claude/settings.json` prohíbe `npm`, `npx` y `yarn`.

## Decisión

Usar pnpm 12 vía Corepack (`packageManager` en `package.json`) y mantener `pnpm-lock.yaml` versionado.

## Alternativas consideradas

- **npm o yarn:** descartados por la regla del proyecto.

## Consecuencias

- Toda la documentación y los scripts usan `pnpm`.
- pnpm verifica las políticas de la cadena de suministro del lockfile antes de ejecutar scripts.
