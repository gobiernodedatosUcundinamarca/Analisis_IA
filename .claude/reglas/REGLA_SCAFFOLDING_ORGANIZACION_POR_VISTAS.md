# Regla de scaffolding y organización por vistas

## 1. Propósito

Definir **cómo se organiza el código de la interfaz**: la arquitectura se estructura **por página/vista**, y cada componente vive **lo más cerca posible de donde se usa** (colocación / *colocation*).

Principio base:

> Un componente que se usa **en una sola vista** vive **dentro de esa vista**. Un componente que es **general** (se reutiliza en varias vistas o es transversal) vive en la **carpeta de componentes generales**.

Esta regla es **general y flexible**: aplica a cualquier tema, módulo o vista, sin imponer cuántos componentes debe tener cada uno.

---

## 2. Principios generales

- **Colocación:** el código específico de una vista (componentes, hooks, utilidades, tipos) se ubica junto a esa vista.
- **Promoción a general:** cuando algo deja de ser específico de una vista, se **mueve** (no se copia) a la zona general.
- **DRY sin abstracción prematura:** no generalizar "por si acaso"; se empieza colocado y se promueve **cuando exista una segunda necesidad real** (ver §5).
- **Responsabilidad única (SOLID):** cada componente hace una cosa; separar presentación de obtención de datos.
- **Sin dependencias cruzadas:** una vista **no importa** componentes privados de otra vista (ver §7).
- Coherente con las demás reglas: [visuales](REGLAS_VISUALES_UCUNDINAMARCA.md), [dashboard](regla_diseno_dashboard.md), [layouts](REGLA_GENERAL_LAYOUTS_APLICACION.md) y [documentación](REGLA_DOCUMENTACION_Y_ACTUALIZACION.md).

---

## 3. Qué es "general" y qué es "específico de vista"

### 3.1 Componentes generales (compartidos)

Van en `src/components/`, `src/features/`, `src/lib/`, `src/hooks/`, `src/types/`. Son generales **SOLO cuando cumplen AL MENOS UNA** de estas condiciones:

- Se usan **en DOS O MÁS vistas** (regla: a la segunda vez que se necesita, se promueve).
- Son **primitivos de UI** (Button, Card, Input, Skeleton, EmptyState, Badge).
- Son de **identidad/marca** (LogoUcundinamarca, paleta de colores).
- Son de **estructura de layout** (Sidebar, ViewHeader, layouts de portada/interno).
- Son **bases reutilizables transversales** (ChartCard de la regla de dashboard).
- Son **datos o servicios compartidos** (dashboardData.ts que alimenta múltiples vistas).

**PROHIBICIÓN:** NO generalizar "por si acaso". Un componente que se usa en UNA SOLA vista, aunque sea complejo, debe estar colocado en esa vista (`_components/`), NUNCA en `features/` general.

```
src/components/
├── ui/        # primitivos generales
├── brand/     # identidad
├── layout/    # estructura de navegación
└── charts/    # bases de gráficas reutilizables
```

### 3.2 Componentes específicos de vista (OBLIGATORIO)

Se **colocan OBLIGATORIAMENTE dentro de la vista** (en su carpeta `_components/`) cuando:

- Solo tienen sentido en esa vista.
- Dependen de la lógica o los datos particulares de esa vista.
- **Se usan EN UNA SOLA vista** (aunque sea complejo o grande).

**PROHIBICIÓN CRÍTICA:** Un componente que se usa en UNA SOLA vista **NUNCA debe estar en `features/` o `src/components/`**, aunque parezca reutilizable. Vive en la vista, punto. Si luego se necesita en una segunda vista, ahí sí se **promueve** a general.

Ejemplo incorrecto:
```
src/features/dashboard/
├── ResumenView.tsx          ❌ MALO: solo se usa en /resumen, debe estar en resumen/_components/
```

Ejemplo correcto:
```
src/app/temas/[temaId]/resumen/
├── page.tsx
└── _components/
    └── ResumenView.tsx      ✅ CORRECTO: específico de esta vista
```

---

## 4. Estructura de una vista (obligatoria)

En el App Router de Next.js, **cada vista debe tener su propia carpeta física e independiente**. Las subcarpetas privadas usan el prefijo **`_`** para no crear rutas. Estructura **recomendada y obligatoria**:

```
app/temas/[temaId]/
├── resumen/
│   ├── page.tsx           # página de la vista Resumen
│   └── _components/       # componentes SOLO de Resumen
│       ├── ResumenKPIs.tsx
│       ├── ResumenChart.tsx
│       └── ResumenUpdates.tsx
├── indicadores/
│   ├── page.tsx           # página de la vista Indicadores
│   └── _components/       # componentes SOLO de Indicadores
│       ├── IndicadorGrid.tsx
│       └── IndicadorCard.tsx
├── reportes/
│   ├── page.tsx           # página de la vista Reportes
│   └── _components/       # componentes SOLO de Reportes
│       └── ReportCard.tsx
├── datos/
│   ├── page.tsx           # página de la vista Datos
│   └── _components/       # componentes SOLO de Datos
│       └── TablaDatos.tsx
└── seguimiento/
    ├── page.tsx           # página de la vista Seguimiento
    └── _components/       # componentes SOLO de Seguimiento
        └── FaseTimeline.tsx
```

Cada vista contiene:
- **`page.tsx`:** archivo raíz que renderiza **únicamente** el contenido de esa vista (sin condicionales de otras vistas).
- **`_components/`:** componentes específicos de esa vista, usando el prefijo `_` para que no generen rutas adicionales.
- **`_hooks/`** (opcional): hooks solo usados en esa vista.
- **`_lib/`** (opcional): utilidades/tipos solo usados en esa vista.

**Prohibido:** usar un parámetro dinámico `[vista]` que resuelva condicionalmente múltiples vistas en un único `page.tsx`. Cada vista es **una ruta independiente con su propia carpeta**.

> **Razón:** Esto asegura que cada vista sea **modulable, escalable e independiente** del resto. Cambios en una vista no afectan a otras. Los componentes de cada vista están aislados físicamente en el árbol de carpetas, reflejando la arquitectura lógica.

---

## 5. Regla de promoción (el corazón de la regla)

1. Un componente nace **colocado** en la vista donde se necesita por primera vez.
2. En el momento en que **una segunda vista** necesita ese mismo componente:
   - **No** se copia ni se importa desde la otra vista.
   - Se **mueve** a la zona general que corresponda (`components/ui`, `components/charts`, etc.).
   - Se actualizan las importaciones de ambas vistas al nuevo origen.
3. Si un componente general deja de ser compartido y queda en una sola vista, **puede** volver a colocarse (opcional; no obligatorio).

> Regla práctica ("de dos"): a la **segunda** vez que se necesita, se generaliza. La primera vez, se coloca.

---

## 6. Árbol de decisión

Al crear un componente, preguntar en orden:

1. ¿Es un primitivo de UI, identidad, layout o base de gráfica? → **general**.
2. ¿Se usará en dos o más vistas? → **general**.
3. ¿Es propio de la lógica/datos de **una sola** vista? → **colocado** en esa vista.
4. ¿Duda? → **colocarlo**; promoverlo después si aparece la segunda necesidad (evita abstracción prematura).

---

## 7. Prohibiciones (críticas)

- **No** colocar en `features/`, `components/` o `src/` general un componente que se usa en **UNA SOLA vista**. Debe estar en `_components/` de esa vista, siempre.
- **No** importar componentes privados (`_components/`) de una vista desde otra vista. Si se necesita en dos, **MOVER** (nunca copiar) a `src/components/` o `src/features/`.
- **No** copiar/pegar el mismo componente entre vistas (rompe DRY): mover a general si se usa en 2+.
- **No** generalizar "por si acaso": un componente nace colocado en la vista; se promueve solo cuando una **segunda vista real** lo necesita.
- **No** duplicar la lógica de layout o identidad dentro de una vista; usar los componentes generales existentes.
- **No** crear estructuras de carpeta distintas para cada vista sin justificación (mantener el patrón).
- **No** exponer como ruta las carpetas de componentes: usar el prefijo `_` en el App Router.

---

## 8. Flexibilidad de la regla

Esta regla **no** define cuántos componentes ni qué contiene cada vista. Se adapta a:

- Cantidad y complejidad de vistas.
- Uso de carpetas colocadas (`_components`) o de `features/<vista>/`.
- Necesidad de subdividir una vista en subcomponentes.

Se permite:

- Agregar nuevas vistas replicando el patrón, sin tocar las existentes (Abierto/Cerrado).
- Anidar `_components/` dentro de un componente colocado grande.
- Mover componentes entre "colocado" y "general" según evolucione el uso.

No se permite:

- Romper el principio de colocación (todo en general) o el de promoción (duplicar entre vistas).

---

## 9. Instrucción de ejecución para Claude

Al crear o modificar vistas:

1. **Crear una carpeta física independiente para cada vista** (resumen/, indicadores/, reportes/, datos/, seguimiento/), no un parámetro dinámico `[vista]` que resuelva todas.
2. Cada vista tiene su propio `page.tsx` (sin condicionales de otras vistas) y su carpeta `_components/`.
3. Colocar los componentes específicos de cada vista dentro de su `_components/`.
4. Usar los componentes **generales** existentes para UI, identidad, layout y gráficas; no reimplementarlos.
5. Si un componente colocado se necesita en una segunda vista, **moverlo** a general (`src/components/`) y actualizar las importaciones de ambas vistas.
6. Nunca importar componentes privados (`_components/`) de una vista desde otra vista; si hace falta, promover a general.
7. Nunca copiar/pegar componentes entre vistas (rompe DRY); mover si es necesario.
8. Ante la duda, colocar en `_components/` de la vista; generalizar solo con una segunda necesidad real.
9. Actualizar la documentación en el mismo cambio (regla de documentación).

---

## 10. Criterios de aceptación

La implementación cumple esta regla cuando:

- **Cada vista tiene su propia carpeta independiente** en el App Router (resumen/, indicadores/, reportes/, datos/, seguimiento/).
- **No existe un parámetro dinámico `[vista]`** que resuelva múltiples vistas con condicionales en un único `page.tsx`.
- Cada vista contiene **solo** sus componentes específicos en su `_components/`.
- Los componentes reutilizados viven en la zona **general** (`src/components/`) y no están duplicados.
- Ninguna vista importa componentes privados (`_components/`) de otra vista.
- El patrón de carpetas es consistente entre vistas.
- Se pueden agregar nuevas vistas replicando el patrón sin modificar las existentes.
- No hay componentes "generales" que en realidad use una sola vista.
- La estructura refuerza que **cada vista es modular e independiente** de las demás.

---

## 11. Regla resumida

> La arquitectura se organiza **por vista**. **Cada vista debe tener su propia carpeta independiente en el App Router** (resumen/, indicadores/, etc.), con su propio `page.tsx` y `_components/`. No usar parámetros dinámicos `[vista]` para resolver múltiples vistas. Cada componente vive lo más cerca posible de donde se usa: **específico de una vista → en su `_components/`**; **reutilizable o transversal → en `src/components/` general**. Un componente nace colocado en la vista y se **promueve** a general en cuanto una segunda vista lo necesita, moviéndolo (nunca copiándolo). Esto asegura que cada vista sea modular, escalable e independiente.
