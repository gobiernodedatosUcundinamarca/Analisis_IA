# Arquitectura

Visión general en la [guía maestra](../../.claude/CLAUDE.md). Este documento detalla las capas y el flujo de datos.

## Capas

```text
src/
├── app/                          Rutas (App Router)
│   ├── layout.tsx                Raíz: Montserrat, metadatos, globals.css
│   ├── page.tsx                  Redirige a la primera vista (sin portada, ADR 0005)
│   └── temas/[temaId]/
│       ├── layout.tsx            EncuestaProvider + MenuLateralFijo + EncabezadoSuperior + BarraFiltros
│       ├── loading.tsx · error.tsx · page.tsx (redirige a /resumen)
│       └── resumen/ uso/ barreras/ metodologia/   page.tsx + _components/ por vista
├── components/                   Generales (usados por 2+ vistas o transversales)
│   ├── brand/                    LogoUcundinamarca
│   ├── layout/                   MenuLateralFijo, EncabezadoSuperior, BarraFiltros
│   ├── charts/                   ChartCard y gráficas
│   └── ui/                       KpiCard, Paneles, Estados
└── lib/
    ├── temas.ts                  Catálogo de temas y vistas
    ├── formato.ts · colores.ts
    └── encuesta/
        ├── tipos.ts              Contrato del JSON
        ├── dimensiones.ts        Dimensiones filtrables, filtrado y serialización a URL
        ├── agregaciones.ts       Distribuciones, proporciones y medias
        ├── presentacion.ts       Conversión de agregados a gráficas, tablas y KPIs
        └── EncuestaProvider.tsx  Carga de datos y estado de filtros
```

## Flujo de datos

1. `scripts/generar_datos.py` lee el Excel y escribe `public/data/encuesta-ia.json`:
   - `meta`, `preguntas` y `catalogos` (opciones con id estable, texto original y etiqueta corta);
   - `filas`: una por respuesta, codificada con ids;
   - `estaticos`: agregados de la muestra completa (el tablero usa el conteo de unidades).
2. `EncuestaProvider` (en el layout del tema) descarga el JSON una vez, crea las dimensiones y lee los filtros iniciales de la URL. Como vive en el layout, datos y filtros se conservan al cambiar de vista.
3. Las vistas obtienen las respuestas con `useFilas(excluir?)` y calculan con `agregaciones.ts`.

## Filtrado cruzado

- Los filtros se combinan con **Y** entre dimensiones y con **O** dentro de una dimensión (`filtrarFilas`).
- Una gráfica llama `useFilas(dimensionPropia)`: ignora su propio filtro para seguir mostrando todas sus opciones, y resalta las seleccionadas (`useSeleccion`).
- Los filtros se reflejan en la URL con `window.history.replaceState`, que Next integra con su router. Los enlaces del menú conservan el `?query`.
- `ChartCard` usa un `modo` (`interactivo`, `responde` o `estatico`); hoy todas las gráficas son `interactivo`.

## Estados

| Estado | Dónde |
|---|---|
| Cargando | `loading.tsx` (navegación) y `Esqueleto` en `ChartCard`/`KpiCard` (datos) |
| Error | `error.tsx` (`retry()`) y `EstadoError` con «Reintentar» (falla del JSON) |
| Vacío | `EstadoVacio` cuando los filtros no dejan respuestas |
| Muestra pequeña | Aviso en `BarraFiltros` con menos de 30 respuestas |
| Tema o ruta inexistente | `temas/not-found.tsx` y `app/not-found.tsx` |

## Decisiones

Ver [ADR](adr/).
