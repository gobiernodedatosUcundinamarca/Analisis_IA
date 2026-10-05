# ADR 0005 · Sin portada y cuatro vistas

- **Estado:** Aceptada (reemplaza la parte de «dos layouts» del [ADR 0001](0001-uso-de-next-app-router.md))
- **Fecha:** 2026-10-05

## Contexto

El tablero tenía una portada de temas y nueve vistas, como pide la regla de layouts. Con un solo tema, el usuario pidió quitar la portada,
eliminar la vista «Nivel de apropiación» y reducir considerablemente las secciones: dejar solo el dashboard con KPIs, gráficas principales y
una lectura breve.

## Decisión

- `/` redirige a la primera vista del primer tema. Se eliminan la portada, el enlace «Volver a temas» y la miga «Portada».
- Cuatro vistas: Resumen, Uso y competencias, Barreras y oportunidades, y Metodología.
- Se retiran las gráficas y explicaciones de detalle (mapas de calor, correlaciones, comparación por funciones, sensibilidad, pruebas,
  tareas abiertas) y el código que solo ellas usaban.

## Alternativas consideradas

- **Mantener la portada con un único tema:** cumple la regla de layouts, pero el usuario la descartó.

## Consecuencias

- Se aparta de la regla de layouts (portada de temas). Si se agregan más temas habrá que reintroducir una portada o un selector de tema.
- El análisis de detalle sigue disponible en el notebook y en `Analisis_EDA_Uso_IA.html`.
