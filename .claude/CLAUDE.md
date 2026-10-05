# Guía maestra · Diagnóstico de uso de IA (UCundinamarca)

Proyecto de análisis de la *Encuesta diagnóstica sobre uso de Inteligencia Artificial en procesos administrativos* (226 respuestas).

**Objetivo del diagnóstico:** identificar el nivel actual de conocimiento, uso y apropiación de herramientas de IA en el personal
administrativo, y las principales oportunidades, necesidades y riesgos para incorporarlas en los procesos institucionales.

Esta guía resume cómo está organizado el proyecto. Las reglas detalladas viven en [`reglas/`](reglas/) y **prevalecen** sobre esta guía.

## Entregables y dónde están

| Entregable | Ruta (desde la raíz *IA analisis*) | Cómo se actualiza |
|---|---|---|
| Datos originales (solo local, no se versionan) | `Encuesta diagnóstica…(1-226).xlsx` | Exportación de Microsoft Forms; no se edita a mano |
| Datos anonimizados (los del repositorio) | `Encuesta_IA_anonimizada.xlsx` | `python anonimizar_encuesta.py`: vacía correo y nombre, agrupa unidades con menos de 3 respuestas |
| Análisis exploratorio | `Analisis_EDA_Uso_IA.ipynb` | Jupyter (Python, pandas, seaborn, scipy) |
| Informe estático | `Analisis_EDA_Uso_IA.html` | `jupyter nbconvert --to html Analisis_EDA_Uso_IA.ipynb` |
| Dashboard web | `dashboard/` | Next.js; ver [README del dashboard](../dashboard/README.md) |

## Stack del dashboard

- Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind CSS 4.
- **Solo pnpm** (`corepack enable`, `pnpm install`, `pnpm dev`). `npm`, `npx` y `yarn` están prohibidos (ver [`settings.json`](settings.json)).
- Gráficas propias en HTML/CSS; íconos `lucide-react`; pruebas con Vitest.
- La versión de Next.js tiene cambios respecto a versiones anteriores: antes de escribir código, consultar `dashboard/node_modules/next/dist/docs/` (ver `dashboard/AGENTS.md`).

## Flujo de datos

```text
Excel anonimizado (raíz) ──pnpm datos──▶ dashboard/scripts/generar_datos.py ──▶ dashboard/public/data/encuesta-ia.json
                                                                          │
                                                       fetch en el layout del tema
                                                                          ▼
                     src/lib/encuesta/EncuestaProvider (datos + filtros en la URL)
                                                                          │
               useFilas / useSeleccion ──▶ agregaciones.ts ──▶ componentes de cada vista
```

- El script replica la limpieza del notebook (funciones, unidades, escalas ordinales, índice de apropiación, temas de P19) y calcula las pruebas estadísticas con scipy.
- El JSON está **anonimizado**: sin nombres, correos ni unidad por respuesta, y sin el texto libre de P19 por respuesta.
- Los porcentajes y KPIs se recalculan en el navegador con los filtros activos.

## Arquitectura (resumen)

- **Sin portada** (decisión del usuario, [ADR 0005](../dashboard/docs/adr/0005-sin-portada-y-cuatro-vistas.md)): `/` abre directamente
  `/temas/diagnostico-ia/resumen`. El layout del tablero (menú lateral fijo no colapsable, encabezado con logo arriba a la derecha y barra
  de filtros) sigue la [regla de layouts](reglas/REGLA_GENERAL_LAYOUTS_APLICACION.md).
- **Cuatro vistas, una carpeta por vista** ([regla de scaffolding](reglas/REGLA_SCAFFOLDING_ORGANIZACION_POR_VISTAS.md)):
  - `resumen` (1. Síntesis del diagnóstico), `uso` (2. Nivel de uso y competencias), `barreras` (3. Brechas y requerimientos) y
    `metodologia` (4. Metodología y ficha técnica). Los nombres siguen el estilo de informe institucional y van numerados en el menú.
  - Cada una tiene `page.tsx` y `_components/`, y muestra solo KPIs, las gráficas principales y unas «Conclusiones del apartado» breves.
  - El índice de apropiación se muestra en la Síntesis y en el filtro «Nivel de apropiación»; su cálculo se explica en `metodologia`.
  - Los componentes compartidos viven en `src/components/{brand,layout,charts,ui}` y la lógica en `src/lib/`.
- **Temas y vistas** se declaran en `dashboard/src/lib/temas.ts`. Para agregar una vista: entrada en el catálogo + carpeta física de la vista.
- Detalle: [arquitectura](../dashboard/docs/arquitectura.md), [guía de desarrollo](../dashboard/docs/guia-desarrollo.md), [componentes](../dashboard/docs/componentes.md) y [ADR](../dashboard/docs/adr/).

## Principios

- **Identidad institucional** ([reglas visuales](reglas/REGLAS_VISUALES_UCUNDINAMARCA.md)):
  - Verdes `#007B3E` / `#00482B` dominantes; oro y amarillo como énfasis.
  - Montserrat.
  - Imagotipo horizontal monocromático (blanco sobre verde, negro sobre claro) mediante el componente `LogoUcundinamarca`.
  - Tokens en `dashboard/src/app/globals.css`; no usar HEX sueltos.
- **Gráficas** ([regla de dashboard](reglas/regla_diseno_dashboard.md)):
  - Cada gráfica va dentro de `ChartCard`, que aporta:
    - título descriptivo con unidad;
    - pregunta de origen (P1–P19) y base de respuestas;
    - insignia «Filtrada» o «Muestra completa»;
    - leyenda cuando hay varias series;
    - vista de tabla;
    - estados de carga, error y vacío.
  - Los elementos seleccionables filtran todo el tablero.
- **Colores de datos:** verde (serie 1), oro (serie 2) y rampa ordinal de verdes, validados para daltonismo. El oro tiene contraste 2,16:1, así que siempre va con etiqueta visible o tabla.
- **Honestidad analítica:**
  - Los textos de lectura usan cifras verificadas de la muestra completa.
  - El índice de apropiación se presenta como construcción del analista, con su fórmula en Metodología.
  - No hay secciones de recomendaciones.
- **Documentación** ([regla de documentación](reglas/REGLA_DOCUMENTACION_Y_ACTUALIZACION.md)): en español y en el mismo cambio que el código. Comprende README, esta guía, `docs/`, ADR, CHANGELOG y TSDoc en los componentes exportados.
- **Git** ([regla de control de versiones](reglas/REGLA_CONTROL_DE_VERSIONES.md)): todo commit o push requiere confirmación explícita. Antes de publicar: `pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm audit`.

## Comandos (desde `dashboard/`)

```bash
pnpm install      # dependencias
pnpm datos        # regenera public/data/encuesta-ia.json desde el Excel
pnpm dev          # desarrollo en http://localhost:3000
pnpm typecheck    # tipos
pnpm lint         # ESLint
pnpm test         # pruebas de cálculos
pnpm build        # producción
```

## Coherencia entre reglas

Las reglas se enlazan entre sí y son coherentes en lo esencial. Puntos a tener en cuenta:

1. [`REGLA_CONTROL_DE_VERSIONES`](reglas/REGLA_CONTROL_DE_VERSIONES.md) §5 menciona `data/`, `src/data/om-rxd.json`, `data-limpio/` y Playwright, que vienen de otro proyecto. Aquí lo versionable es: código, documentación, `scripts/` y `public/data/encuesta-ia.json` (anonimizado).
2. [`REGLA_DOCUMENTACION_Y_ACTUALIZACION`](reglas/REGLA_DOCUMENTACION_Y_ACTUALIZACION.md) enlaza `../../CLAUDE.md` (raíz). Esta guía vive en `.claude/CLAUDE.md`, por lo que desde `reglas/` el enlace correcto es `../CLAUDE.md`.
3. Logo: la regla de layouts da como «implementación actual» el logo en el menú lateral (§8.2, §10.1 opción A), pero §7, §14 y §18 lo exigen arriba a la derecha. El dashboard cumple ambas: imagotipo blanco en el menú y negro en el encabezado.
4. La regla de dashboard §5 pide la variación frente a un «periodo anterior». Esta es la primera medición, así que los KPIs comparan contra el total de la encuesta cuando hay filtros.
5. La carpeta de imágenes se llama `lmagenes` (errata de «imagenes») e incluye `__MACOSX`. Solo hay PNG y `.ai`, aunque la regla visual prefiere SVG. Los PNG usados se copiaron a `dashboard/public/brand/` con nombres normalizados.
6. [`settings.json`](settings.json) restringe `Bash(npm:*)`, `Bash(npx:*)` y `Bash(yarn:*)`, pero no los mismos comandos lanzados desde PowerShell.
7. La regla de layouts exige una portada de temas y un enlace «Volver a temas». Por decisión del usuario el tablero no tiene portada
   ([ADR 0005](../dashboard/docs/adr/0005-sin-portada-y-cuatro-vistas.md)); si se agregan más temas habrá que reintroducirla.
8. La regla visual §2.2 reserva el escudo para usos simbólicos. Por decisión del usuario, el ícono de la pestaña del navegador
   (`dashboard/src/app/icon.png`) es el escudo a color oficial, sin alterar; el identificador de la interfaz sigue siendo el imagotipo.
