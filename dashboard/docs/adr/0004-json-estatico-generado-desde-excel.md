# ADR 0004 · Datos como JSON estático generado desde el Excel

- **Estado:** Aceptada
- **Fecha:** 2026-10-05

## Contexto

La fuente es un Excel exportado de Microsoft Forms (226 respuestas) que no cambia con frecuencia. El análisis de referencia está en Python
(notebook), y el tablero debe reproducir exactamente sus cifras y pruebas estadísticas.

## Decisión

- Un script de Python (`scripts/generar_datos.py`, `pnpm datos`) replica la limpieza del notebook.
- El script escribe `public/data/encuesta-ia.json`:
  - respuestas codificadas y anonimizadas;
  - catálogos de opciones;
  - textos de las preguntas;
  - agregados y pruebas de la muestra completa calculados con scipy.
- El navegador recalcula los porcentajes con los filtros activos.

## Alternativas consideradas

- **Leer el Excel en Next.js:** duplicaría la limpieza en dos lenguajes y expondría columnas que no se deben publicar (unidad, texto libre).
- **Base de datos o API:** innecesaria para un conjunto pequeño y estático.

## Consecuencias

- Una sola fuente de verdad para la limpieza (Python), coherente con el notebook.
- Privacidad: el JSON por respuesta no incluye nombres, correos, unidad ni texto libre.
- Si cambia el Excel hay que ejecutar `pnpm datos` y revisar que los textos de lectura sigan siendo correctos, porque citan cifras de la muestra completa.
