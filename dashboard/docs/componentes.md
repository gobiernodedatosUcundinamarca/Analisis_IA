# Catálogo de componentes generales

Cada componente tiene TSDoc con sus props y un ejemplo de uso en su archivo. Aquí solo se resume para qué sirve cada uno.

## Marca y layout

| Componente | Archivo | Uso |
|---|---|---|
| `LogoUcundinamarca` | `components/brand/` | Imagotipo oficial (`horizontal-blanco`, `horizontal-negro`, `vertical-blanco`). Único punto donde se muestra el logo. |
| `MenuLateralFijo` | `components/layout/` | Menú fijo de las vistas. Escritorio 250 px, tableta 88 px compacto, móvil barra inferior. Conserva los filtros en los enlaces. |
| `EncabezadoSuperior` | `components/layout/` | Ruta de navegación, título y descripción de la vista, logo arriba a la derecha. |
| `BarraFiltros` | `components/layout/` | Filtros generales (funciones, nivel, frecuencia), chips activos, «Limpiar filtros», conteo y aviso de muestra pequeña. |

## Gráficas

| Componente | Uso |
|---|---|
| `ChartCard` | Contenedor obligatorio de toda gráfica: título, insignias, leyenda, tabla, estados y pie con preguntas y base. |
| `GraficaDistribucion` | Distribución de una pregunta con filtrado cruzado (barras o columnas). |
| `BarList` | Barras horizontales de una serie; seleccionables si recibe `onSeleccionar`. |
| `ColumnChart` | Columnas para escalas ordenadas (frecuencia, niveles). |
| `StackedBarRows` | Barras 100 % apiladas por fila (competencias). |
| `DataTable` | Tabla accesible equivalente a una gráfica. |
| `Leyenda` · `Tooltip` | Piezas de apoyo; el tooltip complementa, nunca reemplaza las etiquetas. |

## UI

| Componente | Uso |
|---|---|
| `KpiCard` · `FilaKpis` | Indicador clave con variación frente al total cuando hay filtros; fila responsiva 1/2/4 columnas. |
| `PanelLectura` | Lectura breve de los resultados de una vista (cifras de la muestra completa). |
| `Explicacion` | Bloque desplegable con explicación metodológica. |
| `Esqueleto` · `EstadoVacio` · `EstadoError` | Estados de carga, sin datos y error con reintento. |

## Hooks y utilidades

| Nombre | Archivo | Uso |
|---|---|---|
| `useEncuesta` · `useDatos` · `useFilas` · `useSeleccion` | `lib/encuesta/EncuestaProvider.tsx` | Estado de carga, filtros y respuestas filtradas. |
| `distribucion` · `proporcion` · `media` | `lib/encuesta/agregaciones.ts` | Cálculos puros (probados en `agregaciones.test.ts`). |
| `pct` · `num` · `pp` · `fecha` | `lib/formato.ts` | Formato numérico en español. |
