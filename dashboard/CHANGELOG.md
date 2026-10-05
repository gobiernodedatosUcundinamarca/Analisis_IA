# Historial de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); versionado [SemVer](https://semver.org/lang/es/).

## [0.1.0] - 2026-10-05

### Añadido

- Tablero con menú lateral fijo, encabezado con imagotipo institucional y barra de filtros generales.
- Cuatro apartados numerados: 1. Síntesis del diagnóstico, 2. Nivel de uso y competencias, 3. Brechas y requerimientos, y 4. Metodología y
  ficha técnica (con el cálculo del índice de apropiación).
- Filtrado cruzado desde las gráficas, con los filtros reflejados en la URL, chips de filtros activos y «Limpiar filtros».
- Ícono del navegador con el escudo a color de la Universidad (`src/app/icon.png` y `apple-icon.png`).
- Script `pnpm datos` que genera el JSON anonimizado desde el Excel, y pruebas de los cálculos con Vitest.
- Documentación: README, guía maestra en `.claude/CLAUDE.md`, `docs/` y ADR 0001–0005.

### Seguridad

- Vitest actualizado a 5.0.3: corrige 3 vulnerabilidades de Vitest 3 (1 alta, 2 moderadas; p. ej. GHSA-82fw-gwwq-j7x9).
- Pendiente: `braces` 3.0.3 (alta, denegación de servicio con patrones glob anidados), dependencia de desarrollo de
  `eslint-config-next`. No existe versión corregida; solo afecta a `pnpm lint`, no al tablero publicado.

### Eliminado

- Portada de temas: la raíz abre directamente el Resumen ([ADR 0005](docs/adr/0005-sin-portada-y-cuatro-vistas.md)).
- Vistas de detalle (Nivel de apropiación, Herramientas, Competencias, Beneficios y Oportunidades como vistas separadas) y los componentes
  que solo ellas usaban (`RangeChart`, `HeatGrid`, `GroupedBarList`).
