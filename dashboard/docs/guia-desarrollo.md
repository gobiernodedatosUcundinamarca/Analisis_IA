# Guía de desarrollo

## Puesta en marcha

Ver el [README](../README.md). Todo comando usa **pnpm**.

## Agregar una vista a un tema

1. Declarar la vista en `src/lib/temas.ts` (id, nombre, nombre corto, descripción, ícono). El menú lateral se actualiza solo.
2. Crear la carpeta física `src/app/temas/[temaId]/<id>/` con:
   - `page.tsx`: solo `metadata` y `<Vista…/>`;
   - `_components/Vista<Nombre>.tsx` y los componentes propios de esa vista.
3. Usar los generales existentes:
   - `KpiCard` y `FilaKpis` para los indicadores;
   - `ChartCard` para toda gráfica;
   - `GraficaDistribucion` para la distribución de una pregunta;
   - `PanelLectura` para la explicación de resultados.
4. Si un componente de la vista se necesita en una segunda vista, **moverlo** a `src/components/` (no copiarlo) y actualizar las importaciones.

No se usa un parámetro dinámico `[vista]`: cada vista es una ruta independiente (regla de scaffolding).

## Agregar un tema

1. Generar su JSON con el mismo contrato (`src/lib/encuesta/tipos.ts`) en `public/data/`.
2. Agregar el tema a `TEMAS` en `src/lib/temas.ts` con su `fuenteDatos`.
3. Crear sus vistas.
4. Como no hay portada ([ADR 0005](adr/0005-sin-portada-y-cuatro-vistas.md)), la raíz solo abre el primer tema: con más de un tema hay que
   reintroducir una portada o un selector de tema.

## Agregar una pregunta filtrable

1. Exportarla en `scripts/generar_datos.py`, con su catálogo de opciones e ids estables.
2. Agregar el tipo en `tipos.ts` y la dimensión en `crearDimensiones` (`dimensiones.ts`).
3. Graficarla con `<GraficaDistribucion dim="…" />`.

## Checklist de una gráfica (regla de dashboard §12)

- [ ] Título descriptivo con unidad (p. ej. «… (% de respuestas)»).
- [ ] `preguntas` con los códigos de origen y `n` con la base.
- [ ] `tabla` equivalente y `leyenda` si hay varias series.
- [ ] `modo` correcto (`interactivo` / `responde` / `estatico`).
- [ ] `vacio` cuando no hay datos.
- [ ] Colores solo de `src/lib/colores.ts`; el texto nunca toma el color de la serie.
- [ ] Revisada a 1440, 900 y 390 px de ancho, sin textos solapados ni recortados.

## Verificación antes de publicar

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm audit
```

Los commits y el push requieren confirmación explícita ([regla de control de versiones](../../.claude/reglas/REGLA_CONTROL_DE_VERSIONES.md)).
