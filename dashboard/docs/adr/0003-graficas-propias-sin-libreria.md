# ADR 0003 · Gráficas propias en HTML y CSS

- **Estado:** Aceptada
- **Fecha:** 2026-10-05

## Contexto

Las preguntas de la encuesta son categóricas u ordinales, y sus formas naturales son barras, columnas, barras apiladas, mapas de calor e
intervalos. La regla de dashboard exige en cada gráfica:
- etiquetas sin solaparse;
- tooltips y tabla equivalente;
- clic para filtrar todo el tablero;
- teclado;
- estados de carga, error y vacío;
- colores institucionales.

## Decisión

Construir un conjunto pequeño de gráficas propias con elementos HTML y CSS (`BarList`, `ColumnChart`, `StackedBarRows`, `HeatGrid`,
`GroupedBarList`, `RangeChart`) dentro de un contenedor común `ChartCard`.

## Alternativas consideradas

- **Recharts, Chart.js o ECharts:** añaden peso y su accesibilidad y su modelo de interacción (cada elemento como botón con teclado) requieren
  adaptaciones. Además, sus etiquetas en SVG o canvas tienden a recortarse en móvil.

## Consecuencias

- Cada barra o segmento es un `<button>` con `aria-pressed`: el filtrado funciona con teclado y lector de pantalla.
- Las etiquetas largas se ajustan con el flujo normal del texto, sin recortes.
- Los colores usan tokens validados con el script de paleta (verde y oro para series; rampa ordinal de verdes).
- Para formas complejas que no existan (dispersión, series de tiempo) habría que crear un componente nuevo o revisar esta decisión.
