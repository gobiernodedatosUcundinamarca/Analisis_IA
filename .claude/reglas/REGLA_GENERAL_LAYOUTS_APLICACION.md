# Regla general de diseño para layouts de la aplicación

## 1. Propósito

Esta regla define la estructura general de navegación y distribución visual de la aplicación.

La interfaz debe estar organizada en dos layouts principales:

1. **Layout de presentación o portada**
2. **Layout interno de navegación**

La regla debe aplicarse de forma flexible a diferentes módulos, temas, paneles, reportes o funcionalidades creadas dentro de la aplicación.

---

## 2. Principios generales

- Mantener una estructura visual clara, ordenada y consistente.
- Separar la portada de selección de temas del espacio interno de trabajo.
- Evitar duplicar estructuras de navegación.
- Permitir agregar nuevos temas, módulos y vistas sin modificar la arquitectura general.
- Mantener siempre visible la identidad institucional.
- Priorizar una navegación simple y directa.
- No utilizar menús laterales desplegables o colapsables.
- Todos los componentes deben ser reutilizables.
- El contenido de cada vista puede cambiar, pero la estructura de los layouts debe conservarse.

---

# Layout 1: Portada de temas

## 3. Objetivo

El primer layout funciona como una portada o página de presentación.

Debe mostrar los temas, módulos, proyectos, paneles o espacios creados por el usuario.

Cada tema debe funcionar como un acceso directo al segundo layout.

---

## 4. Estructura del layout de portada

La portada debe incluir:

### 4.1 Encabezado

El encabezado puede contener:

- Nombre de la aplicación.
- Título principal.
- Descripción breve.
- Identidad institucional.
- Acciones generales, cuando sean necesarias.

El encabezado debe ser limpio y no debe competir visualmente con los temas disponibles.

### 4.2 Área de presentación

Debe existir un bloque principal que explique brevemente:

- Qué contiene la aplicación.
- Qué puede hacer el usuario.
- Cómo acceder a los diferentes temas.

Este bloque puede incluir:

- Título.
- Texto introductorio.
- Imagen, ilustración o elemento visual opcional.
- Indicadores generales opcionales.

### 4.3 Contenedor de temas

Los temas creados por el usuario deben mostrarse mediante componentes reutilizables, por ejemplo:

- Tarjetas.
- Bloques.
- Botones visuales.
- Miniaturas.
- Elementos de una cuadrícula.

Cada tema debe incluir, cuando aplique:

- Nombre del tema.
- Descripción breve.
- Icono o imagen.
- Estado.
- Fecha de actualización.
- Acción para ingresar.

### 4.4 Comportamiento de navegación

Al seleccionar un tema:

- El usuario debe ser redirigido al segundo layout.
- La ruta debe identificar el tema seleccionado.
- El contenido del segundo layout debe cargarse según el tema elegido.
- La selección debe mantenerse mientras el usuario navega entre las vistas internas.

Ejemplo conceptual de ruta:

```text
/temas
/temas/:temaId
/temas/:temaId/:vista
```

---

## 5. Reglas visuales de la portada

- La portada no debe utilizar el menú lateral del segundo layout.
- Los temas deben ser fáciles de identificar.
- La cuadrícula debe adaptarse a la cantidad de temas disponibles.
- Las tarjetas deben conservar la misma estructura visual.
- El diseño debe permitir agregar nuevos temas sin rediseñar la página.
- La portada debe servir como punto de entrada principal a la aplicación.
- El usuario debe poder regresar a la portada desde el segundo layout.

---

# Layout 2: Navegación interna

## 6. Objetivo

El segundo layout es el espacio principal de trabajo.

Debe contener la navegación entre las diferentes vistas relacionadas con el tema seleccionado.

Su estructura general debe mantenerse constante, aunque cambie el contenido central.

---

## 7. Estructura del layout interno

El segundo layout debe estar compuesto por:

1. Menú lateral fijo.
2. Encabezado superior.
3. Logo institucional en la esquina superior derecha.
4. Área principal de contenido.
5. Navegación entre vistas internas.

---

## 8. Menú lateral

### 8.1 Comportamiento general

El menú lateral debe ser:

- Fijo.
- Siempre visible.
- No desplegable.
- No colapsable por el usuario.
- Reutilizable para todos los temas.
- Independiente del contenido central.

No debe utilizarse un botón de tipo hamburguesa para mostrar u ocultar el menú en pantallas de escritorio.

### 8.2 Especificaciones técnicas

**Dimensiones y posición:**
- Ancho: 250px fijo
- Altura: 100vh (altura completa de la ventana)
- Posición: sticky (en desktop, se mantiene visible al scrollear)
- Alineación: columna de flex, alineado a la izquierda
- Padding contenedor: 22px 16px

**Estilo visual:**
- Fondo: `linear-gradient(160deg, #00482b 0%, #005c37 100%)` (gradiente verde institucional)
- Texto primario: `rgba(255, 255, 255, 0.82)` (blanco sutil, no puro, para contraste legible)
- Icono (SVG): 18x18px con opacidad 0.8 en estado inactivo, 1 en activo
- Padding items: 11px 12px
- Gap entre items: 3px (separación compacta, agrupar visualmente)
- Border-radius: 11px en items navegables

**Logo institucional (cabecera del sidebar):**
- Contenedor: padding 12px 0 32px, flex centrado
- Altura: 90px fijo
- Ancho: 90% del sidebar (relativo, no fijo)
- Propiedad: `object-fit: contain` (preserva proporciones sin recorte)
- Versión: **imagotipo-horizontal-blanco.png** (blanco para máximo contraste sobre verde)

### 8.3 Contenido del menú

El menú lateral puede incluir:

- **Logo institucional** (parte superior, versión blanca sobre fondo verde)
- Nombre del tema seleccionado (opcional)
- Icono del tema (opcional)
- Etiqueta "Vistas" o similar (label de navegación)
- Enlaces a las diferentes vistas (resumen, indicadores, reportes, datos, seguimiento)
- Enlace para regresar a la portada ("Volver a temas")
- Acciones secundarias (opcional)
- Configuración, cuando aplique (opcional)

**Contenido flexible:** la estructura interna del menú (orden de items, agrupación de secciones, etiquetas adicionales, acciones) puede adaptarse según las necesidades de cada tema, siempre respetando el comportamiento fijo y no colapsable. El logo es el único elemento obligatorio en la cabecera.

Ejemplo conceptual:

```
┌──────────────────┐
│   Logo 90px      │  (imagotipo-horizontal-blanco, 90% ancho)
│  (centrado)      │
└──────────────────┘

Vistas

✓ Resumen         (activo: fondo claro + barra amarilla)
  Indicadores
  Reportes
  Datos
  Seguimiento

─────────────────

[Volver a temas]
```

### 8.4 Estado de navegación (indicadores visuales)

El menú debe indicar claramente:

- La vista activa.
- Las vistas disponibles.
- Las vistas deshabilitadas, cuando existan.
- La relación entre el tema y sus secciones.

**La opción activa debe diferenciarse mediante (no solo color):**

- **Fondo:** `rgba(255, 255, 255, 0.12)` (fondo translúcido, ligeramente más opaco)
- **Indicador lateral izquierdo:** barra vertical de 3px alto contraste amarillo (#fbe122 / --uc-yellow)
- **Tipografía:** font-weight 600 (bolder vs 500 en inactivo)
- **Icono:** opacidad 1 (vs 0.8 en inactivo), más visible
- **Texto:** blanco puro (#fff) en activo, vs blanco sutil `rgba(255, 255, 255, 0.82)` en inactivo

**Vistas disponibles (no activas):**
- Fondo: transparente en hover `rgba(255, 255, 255, 0.08)`
- Texto: `rgba(255, 255, 255, 0.82)`
- Interacción: cambio suave de fondo al pasar el cursor

**Vistas deshabilitadas (muted):**
- Texto: `rgba(255, 255, 255, 0.42)` (opacidad reducida, silenciada)
- Cursor: `default` (no interactivo)
- Sin hover state

No se debe depender únicamente del color para indicar el estado activo.

---

## 9. Encabezado superior

El encabezado superior debe estar ubicado sobre el área de contenido.

Puede incluir:

- Nombre de la vista actual.
- Ruta de navegación.
- Acciones de la vista.
- Perfil del usuario.
- Notificaciones.
- Filtros generales.
- Estado del sistema.

El encabezado debe conservar una altura estable y no debe cambiar de forma brusca entre vistas.

---

## 10. Logo de la universidad

El logo de la universidad debe ser visible y destacado en el layout interno. Puede colocarse en una de estas ubicaciones:

### 10.1 Ubicación del logo

**Opción A (Implementación actual): Cabecera del menú lateral**
- Posición: parte superior del sidebar, centrado
- Altura: 90px
- Ancho: 90% del sidebar (relativo)
- Versión: imagotipo-horizontal-blanco (sobre fondo verde)
- Espaciado: 12px arriba, 32px abajo
- Propiedad: `object-fit: contain` (sin recorte, proporciones intactas)

**Opción B (Alternativa): Esquina superior derecha del encabezado**
- Posición: esquina superior derecha del header/encabezado
- Altura: 40–50px (más compacto que en sidebar)
- Versión: imagotipo-horizontal-blanco o color según fondo
- Espaciado: 16–20px desde los bordes

### 10.2 Reglas generales

Independientemente de la ubicación elegida:

- Debe permanecer visible en todas las vistas internas.
- Debe respetar sus proporciones exactas (no deformar, rotar ni comprimir).
- No debe deformarse ni recortarse (usar `object-fit: contain`).
- No debe utilizarse como fondo o elemento decorativo.
- No debe competir visualmente con el título principal de la vista.
- Debe conservar un área de seguridad (mínimo 8–12px) alrededor.
- Debe utilizar una versión legible según el fondo (blanco sobre verde, o color sobre blanco).
- No debe quedar dentro de elementos interactivos, salvo que se defina como enlace institucional a la portada.

**Componente:** Encapsular el logo en un único componente reutilizable (`LogoUcundinamarca`) que maneje variantes de tipo (horizontal/vertical) y tono (blanco/color/negro) para evitar duplicación.

El logo forma parte de la identidad institucional persistente y no del contenido específico de cada vista.

---

## 11. Área principal de contenido

El área principal debe cambiar según la opción seleccionada en el menú lateral.

Puede contener:

- Dashboards.
- Tablas.
- Formularios.
- Gráficas.
- Indicadores.
- Reportes.
- Documentos.
- Configuraciones.
- Vistas de seguimiento.

Reglas:

- El contenido debe respetar márgenes internos consistentes.
- El ancho disponible debe considerar el espacio ocupado por el menú lateral.
- Cada vista debe tener un título claro.
- Los componentes internos no deben alterar la estructura general del layout.
- Las vistas deben poder reutilizar componentes comunes.
- El contenido debe manejar estados de carga, vacío y error.

---

# 12. Jerarquía general de componentes

La estructura recomendada es:

```text
Aplicación
├── LayoutPortada
│   ├── EncabezadoPortada
│   ├── Presentacion
│   ├── ListaTemas
│   │   └── TarjetaTema
│   └── PieDePaginaOpcional
│
└── LayoutInterno
    ├── MenuLateralFijo
    │   ├── IdentidadTema
    │   ├── NavegacionPrincipal
    │   └── AccionesSecundarias
    ├── EncabezadoSuperior
    │   ├── TituloVista
    │   ├── AccionesVista
    │   └── LogoUniversidad
    └── ContenidoPrincipal
        └── VistaActual
```

---

# 13. Reglas de navegación

- La portada debe mostrar todos los temas disponibles para el usuario.
- Cada tema debe tener una ruta propia.
- El segundo layout debe recibir el tema seleccionado mediante la ruta, estado o parámetro correspondiente.
- Las vistas internas deben conservar el contexto del tema.
- El botón para volver a la portada no debe cerrar sesión.
- Cambiar de vista no debe recargar innecesariamente toda la aplicación.
- Las rutas deben ser legibles y predecibles.
- El historial del navegador debe funcionar correctamente.
- El usuario debe poder compartir o guardar una ruta interna, cuando la autorización lo permita.

---

# 14. Diseño adaptable

La estructura debe adaptarse a diferentes tamaños de pantalla sin perder la lógica de los dos layouts.

## Escritorio

- Menú lateral fijo y completamente visible.
- Encabezado superior horizontal.
- Logo institucional en la esquina superior derecha.
- Área de contenido amplia.

## Tableta

- El menú lateral puede reducir su ancho.
- Puede utilizar iconos acompañados de etiquetas breves.
- Debe continuar visible.
- No debe transformarse en un menú desplegable.

## Dispositivos móviles

Cuando el ancho no permita conservar el menú completo:

- Utilizar una barra lateral compacta fija.
- O utilizar una navegación inferior persistente.
- No depender de un menú oculto tipo hamburguesa.
- Mantener acceso visible a las secciones principales.
- Conservar el logo institucional en el encabezado.
- Permitir desplazamiento vertical del contenido.

La adaptación móvil puede modificar la presentación, pero no debe eliminar la navegación persistente.

---

# 15. Flexibilidad de la regla

Esta regla no define el contenido específico de cada módulo.

Puede adaptarse según:

- Cantidad de temas.
- Cantidad de vistas.
- Tipo de usuario.
- Permisos.
- Tipo de información.
- Tamaño del contenido.
- Necesidades del proyecto.

Se permite:

- Agregar nuevas opciones al menú.
- Cambiar el orden de las vistas.
- Utilizar iconos diferentes.
- Incorporar filtros.
- Incorporar breadcrumbs.
- Agregar indicadores o acciones.
- Ocultar opciones según permisos.

No se permite:

- Eliminar la separación entre portada y layout interno.
- Convertir el menú lateral en un menú desplegable de escritorio.
- Mover el logo institucional a una posición inconsistente entre vistas.
- Crear un layout diferente para cada módulo sin justificación.
- Duplicar el menú lateral dentro de cada página.
- Mezclar la selección de temas con la navegación interna.

---

# 16. Estados obligatorios

Los dos layouts deben contemplar los siguientes estados:

## Portada

- Cargando temas.
- Sin temas disponibles.
- Error al cargar temas.
- Temas disponibles.
- Tema deshabilitado.
- Tema restringido por permisos.

## Layout interno

- Cargando vista.
- Vista vacía.
- Error de carga.
- Sin permisos.
- Ruta no encontrada.
- Tema no encontrado.
- Sesión expirada.

Cada estado debe mostrar un mensaje claro y una acción posible.

---

# 17. Accesibilidad

- Todos los enlaces deben ser accesibles mediante teclado.
- El elemento activo debe tener un estado visual identificable.
- Los iconos deben tener texto alternativo o etiqueta accesible.
- El logo debe incluir texto alternativo.
- El contraste debe ser suficiente.
- La navegación debe mantener un orden lógico.
- El foco debe ser visible.
- Las tarjetas de temas deben poder activarse mediante teclado.
- Los títulos deben mantener una jerarquía semántica correcta.

---

# 18. Criterios de aceptación

La implementación cumple esta regla cuando:

- Existe una portada independiente para mostrar los temas.
- Cada tema redirige al layout interno correspondiente.
- El layout interno utiliza un menú lateral fijo.
- El menú lateral no es desplegable ni colapsable en escritorio.
- El logo de la universidad está en la esquina superior derecha.
- El menú permite navegar entre diferentes vistas.
- La vista activa es claramente identificable.
- El contenido cambia sin alterar la estructura general.
- El usuario puede volver a la portada.
- La solución permite agregar nuevos temas y vistas.
- El diseño se adapta a escritorio, tableta y móvil.
- La identidad institucional se mantiene visible y consistente.

---

# 19. Regla resumida

> La aplicación debe utilizar una portada inicial para presentar los temas creados por el usuario. Cada tema debe redirigir a un segundo layout de trabajo. El segundo layout debe conservar un menú lateral fijo, visible y no desplegable, permitir la navegación entre diferentes vistas y mostrar el logo de la universidad en la esquina superior derecha. La estructura debe ser general, reutilizable, adaptable y flexible para diferentes módulos y tipos de contenido.
