# Regla de diseño para vistas de dashboard

> **OBLIGATORIO:** este documento debe leerse completo antes de crear o modificar cualquier gráfica en el proyecto (componente de gráfica, `ChartCard`, o vista que integre una). No es opcional ni queda cubierto por haberlo leído en una sesión anterior si hay dudas sobre un criterio — se relee la sección relevante. Ninguna gráfica se implementa "por intuición" ignorando §1–12.

## Objetivo

Definir los criterios mínimos de diseño, interacción y visualización para las vistas tipo dashboard, garantizando que las gráficas sean comprensibles, interactivas y consistentes dentro del layout general.

## 1. Títulos de las gráficas

- Toda gráfica debe incluir un título visible.
- El título debe describir claramente la información representada.
- Debe ubicarse en la parte superior de la gráfica.
- No se permiten títulos genéricos como “Gráfica 1”, “Resultados” o “Datos”.
- Cuando sea necesario, el título debe indicar:
  - Variable analizada.
  - Periodo.
  - Unidad de medida.
  - Segmento o población representada.

Ejemplo:

```text
Porcentaje de satisfacción por sede — Periodo 2026-I
```

## 2. Etiquetas de datos

- Todas las gráficas deben incluir las etiquetas necesarias para interpretar los datos.
- Las barras, puntos, segmentos o elementos gráficos deben mostrar su valor mediante:
  - Etiqueta visible.
  - Tooltip al pasar el cursor.
  - Leyenda, cuando existan varias categorías o series.
- Los ejes deben incluir nombres claros.
- Los valores porcentuales deben incluir el símbolo `%`.
- Los valores numéricos deben utilizar separadores de miles cuando corresponda.
- Las etiquetas no deben superponerse ni quedar cortadas.
- Cuando no exista espacio suficiente, las etiquetas pueden mostrarse mediante tooltip.

## 3. Interacción como filtro

- Cada barra, punto, segmento, categoría, elemento de leyenda o ítem seleccionable debe poder actuar como filtro.
- Al seleccionar un elemento de una gráfica, las demás gráficas, indicadores y tablas del dashboard deben actualizarse con base en dicha selección.
- La interacción debe aplicarse únicamente cuando exista una relación lógica entre los datos.
- El elemento seleccionado debe permanecer visualmente destacado.
- Los elementos no seleccionados pueden reducir su opacidad, pero deben continuar siendo visibles.
- El filtro debe mostrar claramente qué valor o categoría está activo.

Ejemplo:

```text
Filtro activo: Sede Fusagasugá
```

## 4. Comportamiento de los filtros

- El usuario debe poder seleccionar uno o varios elementos cuando la lógica del dashboard lo permita.
- Debe existir una opción visible para limpiar o restablecer los filtros.
- Los filtros aplicados desde una gráfica deben sincronizarse con los filtros generales del dashboard.
- No deben generarse filtros duplicados.
- Al cambiar o eliminar una selección, todas las visualizaciones deben actualizarse inmediatamente.
- Cuando un filtro no produzca resultados, debe mostrarse un estado vacío informativo.

Ejemplo:

```text
No existen datos para los filtros seleccionados.
```

## 5. Indicadores clave (KPIs) — recomendados

Cada dashboard debe mostrar **indicadores clave** que resuman el estado general:

- **Ubicación:** parte superior, antes de las gráficas de detalle.
- **Formato:** tarjetas o cajas que muestren:
  - Nombre del indicador.
  - Valor actual (números grandes y legibles).
  - Variación o delta respecto a periodo anterior (↑/↓ con color).
  - Meta o objetivo (opcional, si aplica).
- **Cantidad:** 3–6 KPIs por dashboard (más causa sobrecarga visual).
- **Interactividad:** opcionales, pueden filtrase con los filtros generales del dashboard.
- **Responsividad:** en desktop 4 columnas, tableta 2, móvil 1.

Los KPIs permiten la toma rápida de decisiones sin necesidad de explorar gráficas.

## 6. Filtros — recomendados pero opcionales

Los dashboards deben incluir **filtros de contexto** para segmentar datos:

- **Ubicación:** barra superior, debajo del título, antes de gráficas/KPIs.
- **Tipos recomendados:**
  - Filtro por periodo/fecha.
  - Filtro por sede, región o ubicación.
  - Filtro por categoría relevante al contexto.
- **Comportamiento:**
  - Los filtros afectan a KPIs, gráficas y tablas simultáneamente.
  - Debe existir un botón **"Limpiar filtros"** visible.
  - Los filtros activos deben mostrarse claramente (chips, badges).
  - Cambiar un filtro actualiza las visualizaciones sin recarga.
- **Flexibilidad:** no todos los dashboards necesitan filtros; agregar solo si aportan valor.

## 7. Layout del dashboard

- Las gráficas deben organizarse dentro de una cuadrícula consistente.
- El layout debe adaptarse correctamente a diferentes tamaños de pantalla.
- Ninguna gráfica debe quedar cortada, desbordada o superpuesta.
- Las gráficas deben conservar una altura mínima que permita interpretar títulos, etiquetas, ejes y leyendas.
- Las gráficas relacionadas deben ubicarse próximas entre sí.
- Los **KPIs deben aparecer al inicio**, seguidos de filtros (si existen), luego gráficas de detalle.
- Debe mantenerse una separación uniforme entre componentes.
- El dashboard no debe depender del desplazamiento horizontal para visualizar información principal.

## 8. Visualización responsiva

### Escritorio

- Las gráficas pueden organizarse en dos o tres columnas según su complejidad.
- Las gráficas con muchas categorías deben ocupar mayor ancho.
- Las tablas y gráficas de detalle pueden utilizar el ancho completo.

### Tableta

- El dashboard debe utilizar una o dos columnas.
- Las etiquetas deben mantenerse legibles.
- Las leyendas pueden ubicarse debajo de la gráfica.

### Dispositivos móviles

- Las gráficas deben mostrarse en una sola columna.
- Cada visualización debe ocupar el ancho disponible.
- Los títulos no deben truncarse.
- Las etiquetas extensas deben ajustarse, abreviarse o mostrarse mediante tooltip.
- Las interacciones deben funcionar mediante toque y no depender exclusivamente del cursor.

## 9. Estados de las gráficas

Toda gráfica debe contemplar los siguientes estados:

### Cargando

Debe mostrarse un indicador de carga o un esqueleto visual mientras se consultan los datos.

### Sin datos

Debe mostrarse un mensaje claro cuando no existan registros.

### Error

Debe informarse que los datos no pudieron cargarse y ofrecer una acción para reintentar.

### Filtrada

Debe visualizarse claramente que la gráfica está mostrando información filtrada.

### Seleccionada

El elemento seleccionado debe resaltarse de forma evidente y accesible.

## 10. Consistencia visual

- Las gráficas deben utilizar colores consistentes para representar una misma categoría en todo el dashboard.
- No se debe asignar un color diferente a una categoría entre distintas gráficas.
- Los colores deben conservar suficiente contraste.
- El color no debe ser el único recurso para indicar una selección o estado.
- Las gráficas deben mantener tipografías, tamaños, bordes, espaciados y estilos uniformes.

## 11. Accesibilidad

- Las gráficas deben ser comprensibles mediante colores, etiquetas y valores.
- Los elementos interactivos deben ser accesibles mediante teclado.
- La selección debe identificarse visualmente mediante más de un recurso, como:
  - Color.
  - Borde.
  - Ícono.
  - Texto.
  - Cambio de opacidad.
- Los tooltips deben tener contraste suficiente.
- Los títulos y etiquetas deben mantener un tamaño legible.

## 12. Regla general obligatoria

Ninguna gráfica podrá incorporarse al dashboard si no cumple como mínimo con los siguientes elementos:

1. Título descriptivo.
2. Etiquetas, ejes o tooltips que permitan interpretar los valores.
3. Leyenda cuando existan varias categorías o series.
4. Comportamiento responsivo dentro del layout.
5. Estado de carga, error y ausencia de datos.
6. Integración con los filtros generales.
7. Interacción como filtro cuando sus elementos sean seleccionables.
8. Opción para limpiar o restablecer la selección.
9. Identificación visible de los filtros activos.
10. Correcta actualización de las demás visualizaciones relacionadas.
