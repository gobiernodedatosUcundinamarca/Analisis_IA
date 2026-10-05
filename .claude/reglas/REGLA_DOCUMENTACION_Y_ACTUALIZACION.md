# Regla de documentación y su actualización

## 1. Propósito

Definir cómo se **crea, estructura y mantiene actualizada** la documentación del proyecto. La documentación es parte del entregable: un cambio de código sin su documentación actualizada se considera **incompleto** y no debe fusionarse.

Esta regla aplica de forma flexible a cualquier módulo, tema, vista o componente del proyecto.

---

## 2. Principios generales (docs-as-code)

- La documentación vive **en el repositorio**, en Markdown, versionada con git.
- Se **actualiza en el mismo commit/PR** que el cambio que la afecta. Nunca "después".
- **DRY:** una sola fuente de verdad por tema; **enlazar** en lugar de duplicar contenido.
- Idioma **español**; redacción clara, concisa y orientada a la acción.
- Coherente con las demás reglas ([visuales](REGLAS_VISUALES_UCUNDINAMARCA.md), [dashboard](regla_diseno_dashboard.md), [layouts](REGLA_GENERAL_LAYOUTS_APLICACION.md)) y con el [CLAUDE.md](../../CLAUDE.md).
- Todos los ejemplos de comandos usan **pnpm** (nunca npm ni yarn).

---

## 3. Qué documentar y dónde

| Documento | Ubicación | Contenido |
|---|---|---|
| `README.md` | Raíz | Qué es, requisitos, arranque con pnpm, scripts, enlaces. Público. |
| `CLAUDE.md` | Raíz | Guía maestra: arquitectura, stack, principios, reglas. |
| Documentación extendida | `docs/` | Arquitectura, guías de desarrollo, catálogo de componentes. |
| Decisiones (ADR) | `docs/adr/` | Registro inmutable de decisiones técnicas. |
| `CHANGELOG.md` | Raíz | Historial de cambios (Keep a Changelog + SemVer). |
| Reglas de diseño/negocio | `.claude/reglas/` | Estas reglas. |
| Documentación de código | En el propio código | TSDoc/JSDoc en componentes, hooks, utilidades y tipos públicos. |

Cada tema tiene **un** dueño documental. No repetir el mismo contenido en dos lugares: enlazar.

---

## 4. Estructura de `docs/`

```
docs/
├── arquitectura.md        # Visión general, capas, flujo de datos, decisiones vigentes
├── guia-desarrollo.md     # Setup con pnpm, convenciones, cómo agregar temas/vistas
├── componentes.md         # Catálogo de componentes reutilizables y su uso
└── adr/
    ├── 0001-uso-de-next-app-router.md
    ├── 0002-solo-pnpm-como-gestor.md
    └── ...
```

---

## 5. `README.md` — contenido mínimo

- Nombre del proyecto y descripción breve.
- Stack (Next.js, TypeScript, Tailwind, pnpm).
- Requisitos previos (Node.js LTS, Corepack, pnpm).
- Instalación y arranque **solo con pnpm** (`corepack enable`, `pnpm install`, `pnpm dev`).
- Scripts disponibles.
- Estructura resumida del proyecto.
- Enlaces a `docs/`, `.claude/reglas/` y `CLAUDE.md`.

El README **no duplica** el CLAUDE.md: da el arranque rápido y **enlaza** a la guía maestra.

---

## 6. Documentación de código

- Documentar con **TSDoc/JSDoc** todo componente exportado, hook, utilidad y tipo público.
- Describir cada prop con su tipo y propósito.
- Incluir **ejemplo de uso** en los componentes reutilizables (`LogoUcundinamarca`, `ChartCard`, `TarjetaTema`, `MenuLateralFijo`…).
- Nombres autoexplicativos (reducen la necesidad de comentar el "qué"); los comentarios explican el **"por qué"**, no el "qué".
- No documentar detalles internos que cambian a menudo; documentar contratos estables (interfaces, props).

---

## 7. Registro de decisiones (ADR)

- Cada decisión arquitectónica relevante = **un ADR numerado** (`0001`, `0002`, …).
- Formato mínimo: **Contexto → Decisión → Alternativas consideradas → Consecuencias → Estado** (`Aceptada` / `Reemplazada por ADR-XXXX`).
- Los ADR son **inmutables**: no se borran ni reescriben; se marcan como reemplazados.
- Ejemplos que deben tener ADR: elección de Next.js App Router, "solo pnpm", librería de gráficas, estrategia de fuente de datos.

---

## 8. Changelog y versionado

- Mantener `CHANGELOG.md` siguiendo **Keep a Changelog** y versionado **SemVer**.
- Categorías: **Añadido, Cambiado, Corregido, Eliminado, Seguridad**.
- Registrar actualizaciones de dependencias y **parches de seguridad** bajo *Seguridad*.

---

## 9. Cuándo actualizar (disparadores obligatorios)

Actualizar la documentación correspondiente **en el mismo cambio** cuando:

- Se **agrega, cambia o elimina** un componente, ruta, layout o vista → `docs/` y TSDoc.
- Cambia el **stack, versiones o comandos** → README y CLAUDE.md.
- Se **agrega o modifica una regla** en `.claude/reglas/` → enlazarla en la sección de coherencia del CLAUDE.md.
- Cambian **tokens visuales, logo o tipografía** → actualizar doc de identidad y el mapeo de assets a `public/brand/`.
- Se toma una **decisión arquitectónica** → nuevo ADR.
- Se corrige una **vulnerabilidad** o se actualizan dependencias → `CHANGELOG.md` (*Seguridad*).

---

## 10. Sincronización del CLAUDE.md

- El CLAUDE.md es la **guía maestra**: todo cambio estructural (arquitectura, carpetas, comandos, reglas) debe reflejarse allí en el mismo cambio.
- Al añadir una regla, enlazarla en la sección de coherencia entre reglas.
- No dejar secciones "por definir" que ya fueron definidas; mantenerlo vigente.

---

## 11. Estilo y formato

- Markdown válido: encabezados jerárquicos, tablas para datos tabulares, bloques de código con lenguaje declarado.
- **Enlaces relativos clicables** a archivos y reglas (p. ej. `[regla visual](REGLAS_VISUALES_UCUNDINAMARCA.md)`).
- Comandos siempre con **pnpm**.
- Preferir texto y **diagramas en código** (mermaid o ASCII) sobre capturas de pantalla (se desactualizan).

---

## 12. Prohibiciones

- No dejar documentación **desactualizada** respecto al código.
- No **duplicar** el mismo contenido en varios archivos (enlazar).
- No documentar en un idioma distinto del **español** (salvo identificadores técnicos).
- No usar **npm ni yarn** en ejemplos de comandos.
- No **borrar** historial de ADR ni de CHANGELOG; marcar como reemplazado.
- No incluir **secretos, credenciales ni datos sensibles** en la documentación.

---

## 13. Instrucción de ejecución para Claude

Al crear o modificar código:

1. Actualizar en el **mismo cambio** la documentación afectada (README, CLAUDE.md, `docs/`, TSDoc).
2. Si hubo una decisión arquitectónica, crear el **ADR** correspondiente.
3. Registrar en `CHANGELOG.md` cuando aplique (especialmente *Seguridad*).
4. Verificar que los **enlaces** funcionen y que haya coherencia con las demás reglas.
5. Usar únicamente **pnpm** en cualquier ejemplo de comando.

---

## 14. Criterios de aceptación

La implementación cumple esta regla cuando:

- El código nuevo o modificado llega **con su documentación actualizada**.
- El `README.md` permite arrancar el proyecto **solo con pnpm** sin pasos faltantes.
- El `CLAUDE.md` refleja la estructura, el stack y las reglas actuales.
- Las decisiones relevantes tienen su **ADR**.
- No hay contenido **duplicado ni desactualizado**.
- Todos los enlaces son válidos.

---

## 15. Regla resumida

> La documentación es parte del entregable y se actualiza en el **mismo cambio** que la origina. Vive en el repositorio, en español y en Markdown, con una única fuente de verdad por tema (DRY) y enlaces en lugar de duplicados. El README arranca el proyecto **solo con pnpm**, el CLAUDE.md se mantiene como guía maestra vigente, las decisiones se registran como ADR inmutables y los cambios relevantes quedan en el CHANGELOG.
