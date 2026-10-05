# ADR 0001 · Next.js con App Router

- **Estado:** Aceptada
- **Fecha:** 2026-10-05

## Contexto

Se necesita un tablero web para presentar el diagnóstico de IA con dos layouts (portada de temas y navegación interna), una ruta por vista y
filtros compartidos entre vistas. Las reglas del proyecto exigen carpetas por vista con `page.tsx` y `_components/`.

## Decisión

Usar Next.js 16 con App Router y TypeScript. El layout de `temas/[temaId]` aloja el proveedor de datos y filtros, de modo que estos persisten
al navegar entre vistas.

## Alternativas consideradas

- **HTML estático generado desde el notebook:** ya existe (`Analisis_EDA_Uso_IA.html`), pero no permite filtrar ni navegar por vistas.
- **Vite + React Router:** viable, pero las reglas de scaffolding están escritas para el App Router (carpetas privadas `_components/`).

## Consecuencias

- Rutas legibles y compartibles (`/temas/diagnostico-ia/barreras?funciones=directivas`).
- Las vistas son componentes cliente, porque los filtros viven en el navegador.
- Next 16 cambia APIs respecto a versiones anteriores (por ejemplo, `params` es asíncrono y `error.tsx` usa `retry()`): consultar `node_modules/next/dist/docs/`.
