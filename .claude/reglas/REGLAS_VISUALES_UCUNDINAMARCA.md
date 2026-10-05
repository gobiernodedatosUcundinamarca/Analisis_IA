# Reglas visuales para Claude — UCundinamarca

Estas reglas deben aplicarse al diseñar, generar o modificar interfaces digitales de la Universidad de Cundinamarca.

El alcance de esta regla se limita exclusivamente a:

- Colores.
- Logotipo, imagotipo y escudo.
- Tipografía.

No agregar reglas sobre navegación, gráficos, tablas, indicadores, filtros, arquitectura, componentes funcionales o lógica de negocio.

Documento visual de referencia: **Manual de Imagen Institucional ECOM002, versión 18**.

---

## 1. Reglas de color

### 1.1 Paleta institucional principal

Los siguientes colores son los colores principales oficiales y deben tener predominio en la identidad visual.

| Token CSS | Color | HEX | RGB | Pantone |
|---|---|---:|---:|---|
| `--uc-yellow` | Amarillo institucional | `#FBE122` | `251, 225, 34` | `107 C` |
| `--uc-gold` | Oro institucional | `#DAAA00` | `218, 170, 0` | `110 C` |
| `--uc-green` | Verde institucional | `#007B3E` | `0, 123, 62` | `3536 C` |
| `--uc-green-dark` | Verde institucional oscuro | `#00482B` | `0, 72, 43` | `3537 C` |

### 1.2 Paleta institucional secundaria

Los siguientes colores complementan la paleta principal y pueden emplearse para crear variedad, jerarquía y diferenciación visual.

| Token CSS | Color | HEX | RGB | Pantone |
|---|---|---:|---:|---|
| `--uc-orange` | Naranja | `#F7931E` | `247, 147, 30` | `144 C` |
| `--uc-lime` | Verde lima | `#79C000` | `121, 192, 0` | `3561 C` |
| `--uc-green-light` | Verde claro | `#91C256` | `145, 194, 86` | `367 C` |
| `--uc-turquoise` | Turquesa | `#00A99D` | `0, 169, 157` | `7716 C` |
| `--uc-gray-dark` | Gris oscuro | `#4D4D4D` | `77, 77, 77` | `425 C` |

### 1.3 Colores neutros de soporte

Estos colores se utilizan como soporte técnico para fondos, texto, divisores y superficies. No reemplazan la paleta institucional.

| Token CSS | HEX | Uso |
|---|---:|---|
| `--uc-white` | `#FFFFFF` | Fondo principal y texto invertido |
| `--uc-black` | `#000000` | Uso restringido cuando se requiera máximo contraste |
| `--uc-background` | `#F7F7F5` | Fondo general claro |
| `--uc-surface` | `#FFFFFF` | Superficies y contenedores |
| `--uc-border` | `#D9DDD9` | Bordes y divisores |
| `--uc-text` | `#2B2B2B` | Texto principal |
| `--uc-text-secondary` | `#666666` | Texto secundario |

### 1.4 Degradados institucionales permitidos

Usar únicamente las combinaciones oficiales. No crear degradados adicionales.

```css
--uc-gradient-green-turquoise:
  linear-gradient(135deg, #007B3E 0%, #79C000 50%, #00A99D 100%);

--uc-gradient-deep-green:
  linear-gradient(135deg, #00482B 0%, #007B3E 50%, #79C000 100%);

--uc-gradient-turquoise-gold:
  linear-gradient(135deg, #00A99D 0%, #FBE122 50%, #DAAA00 100%);

--uc-gradient-green-orange:
  linear-gradient(135deg, #00482B 0%, #DAAA00 50%, #F7931E 100%);
```

La dirección y distribución porcentual pueden adaptarse al formato, pero no se deben sustituir los colores que conforman cada degradado.

### 1.5 Jerarquía cromática

- La identidad visual debe estar dominada por `#007B3E` y `#00482B`.
- El amarillo `#FBE122` y el oro `#DAAA00` se utilizan para énfasis institucional.
- Los colores secundarios deben complementar, no competir con la paleta principal.
- Usar blanco y fondos claros para mantener legibilidad y equilibrio.
- Evitar aplicar todos los colores simultáneamente en una misma composición.
- Usar como máximo un color principal y dos colores complementarios por vista.
- El gris oscuro `#4D4D4D` puede utilizarse en textos, iconos y elementos neutros.
- Los colores propios del escudo deben conservarse exclusivamente mediante el archivo oficial.

### 1.6 Colores del escudo

El escudo a color incluye:

- Verde.
- Oro y amarillo.
- Trazos internos correspondientes a los colores de la bandera del departamento: azul claro, amarillo y rojo.

Los valores técnicos del azul claro y del rojo no se deben estimar ni reconstruir manualmente. Deben provenir del archivo institucional oficial del escudo.

### 1.7 Prohibiciones de color

- No sustituir los colores principales por tonos aproximados.
- No usar `#004A2B` como verde oficial; el valor oficial oscuro es `#00482B`.
- No alterar los colores del imagotipo, logotipo o escudo.
- No recolorear el escudo con los colores secundarios.
- No crear degradados diferentes de las combinaciones autorizadas.
- No usar colores neón.
- No usar colores excesivamente saturados ajenos a la paleta.
- No usar valores HEX aislados cuando exista un token institucional.
- No utilizar el rojo o azul del escudo como colores principales de la interfaz.
- No usar colores secundarios con mayor presencia que los verdes institucionales.

### 1.8 Variables CSS oficiales

```css
:root {
  /* Paleta principal oficial */
  --uc-yellow: #fbe122;
  --uc-gold: #daaa00;
  --uc-green: #007b3e;
  --uc-green-dark: #00482b;

  /* Paleta secundaria oficial */
  --uc-orange: #f7931e;
  --uc-lime: #79c000;
  --uc-green-light: #91c256;
  --uc-turquoise: #00a99d;
  --uc-gray-dark: #4d4d4d;

  /* Neutros técnicos */
  --uc-white: #ffffff;
  --uc-black: #000000;
  --uc-background: #f7f7f5;
  --uc-surface: #ffffff;
  --uc-border: #d9ddd9;
  --uc-text: #2b2b2b;
  --uc-text-secondary: #666666;

  /* Aplicación */
  --uc-color-primary: var(--uc-green);
  --uc-color-primary-dark: var(--uc-green-dark);
  --uc-color-accent: var(--uc-yellow);
  --uc-color-accent-dark: var(--uc-gold);
  --uc-color-secondary: var(--uc-turquoise);

  /* Interacción */
  --uc-color-primary-hover: var(--uc-green-dark);
  --uc-focus-ring: rgba(0, 123, 62, 0.28);
  --uc-overlay: rgba(0, 72, 43, 0.55);

  /* Degradados oficiales */
  --uc-gradient-green-turquoise:
    linear-gradient(135deg, #007b3e 0%, #79c000 50%, #00a99d 100%);

  --uc-gradient-deep-green:
    linear-gradient(135deg, #00482b 0%, #007b3e 50%, #79c000 100%);

  --uc-gradient-turquoise-gold:
    linear-gradient(135deg, #00a99d 0%, #fbe122 50%, #daaa00 100%);

  --uc-gradient-green-orange:
    linear-gradient(135deg, #00482b 0%, #daaa00 50%, #f7931e 100%);

  /* Alias en español */
  --uc-verde: var(--uc-green);
  --uc-verde-oscuro: var(--uc-green-dark);
  --uc-amarillo: var(--uc-yellow);
  --uc-oro: var(--uc-gold);
  --uc-naranja: var(--uc-orange);
  --uc-verde-lima: var(--uc-lime);
  --uc-verde-claro: var(--uc-green-light);
  --uc-turquesa: var(--uc-turquoise);
  --uc-gris-oscuro: var(--uc-gray-dark);
}
```

---

## 2. Reglas del logotipo, imagotipo y escudo

### 2.1 Identificador para interfaces digitales

- Usar el **imagotipo institucional horizontal en versión monocromática** para diseños digitales.
- El imagotipo debe ser el identificador principal de la interfaz.
- Usar la versión vertical únicamente cuando el espacio disponible sea reducido.
- Mantener la relación de aspecto original.
- Preferir archivos institucionales en formato `SVG`.
- Usar `PNG` transparente solo cuando no exista versión vectorial.
- Mantener el área de seguridad mínima equivalente a un cuarto de la altura del escudo.
- Mantener la denominación **Universidad de Cundinamarca** sin traducción.
- Colocar el imagotipo sobre fondos que permitan una lectura clara.
- Usar `object-fit: contain` dentro de contenedores.

### 2.2 Uso restringido del escudo

El escudo o isotipo no debe utilizarse como identificador general de una interfaz digital.

Su uso se reserva para:

- Bandera institucional.
- Placas conmemorativas.
- Elementos simbólicos.
- Aplicaciones institucionales de carácter ceremonial o histórico.

### 2.3 Versiones permitidas

- Policromía o versión a color.
- Línea en positivo.
- Línea en negativo.
- Imagotipo horizontal monocromático para diseños digitales.
- Imagotipo vertical cuando la composición tenga espacio reducido.

### 2.4 Prohibiciones

- No deformar, estirar o comprimir.
- No rotar.
- No recortar.
- No fragmentar.
- No alterar el orden de sus elementos.
- No cambiar colores.
- No cambiar la tipografía incorporada.
- No agregar sombras, contornos, brillos o efectos tridimensionales.
- No reconstruir manualmente.
- No reemplazar el imagotipo por texto escrito.
- No usar archivos de baja resolución.
- No colocar sobre fondos que reduzcan su visibilidad.
- No usar el escudo como logo operativo habitual de un dashboard.
- No combinar con símbolos políticos, religiosos o marcas de gobierno.

### 2.5 Tamaño mínimo

- El escudo debe conservar una altura mínima de `20 mm` en aplicaciones impresas.
- En interfaces digitales, no reducir el imagotipo hasta perder legibilidad.
- La denominación institucional debe permanecer completamente reconocible.

### 2.6 Ejemplo de implementación

```html
<img
  src="/brand/imagotipo-ucundinamarca-horizontal-monocromatico.svg"
  alt="Universidad de Cundinamarca"
  class="h-12 w-auto object-contain"
/>
```

---

## 3. Reglas tipográficas

El sistema institucional permite tres familias tipográficas:

1. `Century Gothic`
2. `Times New Roman`
3. `Montserrat`

### 3.1 Tipografía para interfaces digitales

Usar `Montserrat` como familia principal para interfaces, aplicaciones y dashboards.

```css
font-family: "Montserrat", "Century Gothic", Arial, sans-serif;
```

### 3.2 Uso de las familias

| Familia | Uso |
|---|---|
| `Montserrat` | Interfaces digitales, títulos, botones, etiquetas y contenido web |
| `Century Gothic` | Alternativa institucional sans-serif para piezas y textos de apoyo |
| `Times New Roman` | Documentos formales, textos extensos o aplicaciones editoriales |

### 3.3 Jerarquía recomendada

| Nivel | Tamaño | Peso | Uso |
|---|---:|---:|---|
| Título principal | `28-32 px` | `700` | Título de la interfaz |
| Título de sección | `20-24 px` | `600` | Secciones principales |
| Subtítulo | `16-18 px` | `600` | Agrupaciones internas |
| Texto normal | `14-16 px` | `400` | Contenido general |
| Etiquetas | `12-14 px` | `500` | Campos y controles |
| Texto auxiliar | `12-13 px` | `400` | Notas, fechas y referencias |

### 3.4 Aplicación obligatoria

- Usar `Montserrat` como primera opción en interfaces digitales.
- Mantener una jerarquía tipográfica consistente.
- Usar negrita únicamente para títulos y énfasis.
- Mantener alineación a la izquierda en títulos, etiquetas y párrafos.
- Usar un interlineado entre `1.4` y `1.6`.
- Mantener la tipografía original incorporada en el imagotipo.
- Reservar las mayúsculas para siglas, nombres oficiales y títulos breves.

### 3.5 Prohibiciones

- No usar `Inter` como tipografía institucional principal.
- No usar tipografías manuscritas o decorativas.
- No mezclar familias sin una función definida.
- No escribir párrafos completos en mayúsculas.
- No modificar la tipografía que forma parte del imagotipo.
- No usar pesos o tamaños inconsistentes entre elementos equivalentes.

### 3.6 Variables CSS tipográficas

```css
:root {
  --uc-font-digital:
    "Montserrat",
    "Century Gothic",
    Arial,
    sans-serif;

  --uc-font-institutional:
    "Century Gothic",
    Arial,
    sans-serif;

  --uc-font-formal:
    "Times New Roman",
    Times,
    serif;

  --uc-font-size-title: 2rem;
  --uc-font-size-section: 1.5rem;
  --uc-font-size-subtitle: 1.125rem;
  --uc-font-size-body: 1rem;
  --uc-font-size-label: 0.875rem;
  --uc-font-size-small: 0.75rem;

  --uc-font-regular: 400;
  --uc-font-medium: 500;
  --uc-font-semibold: 600;
  --uc-font-bold: 700;

  --uc-line-height-body: 1.5;
}
```

---

## 4. Instrucción de ejecución para Claude

Al generar o modificar una interfaz:

1. Aplicar exclusivamente los colores institucionales definidos en esta regla.
2. Priorizar `#007B3E` y `#00482B` como colores dominantes.
3. Utilizar amarillo, oro y colores secundarios como apoyo visual.
4. Usar únicamente los cuatro degradados institucionales definidos.
5. Usar el imagotipo horizontal monocromático en interfaces digitales.
6. Reservar el escudo para aplicaciones simbólicas.
7. Usar `Montserrat` como tipografía principal digital.
8. No inventar colores, variaciones del logo ni familias tipográficas.
9. No incorporar reglas funcionales ajenas a colores, identificadores y tipografía.
