import type { DatosEncuesta, Fila, IdCompetencia, Opcion } from "./tipos";

/** Dimensiones por las que se puede filtrar (desde la barra de filtros o haciendo clic en una gráfica). */
export type IdDimension =
  | "funciones"
  | "uso"
  | "frecuencia"
  | "madurez"
  | "cambio"
  | "claridad"
  | "nivel"
  | "herramientas"
  | "actividades"
  | "beneficios"
  | "barreras"
  | "oportunidades"
  | "apoyos"
  | "temas"
  | `comp_${IdCompetencia}`;

export interface Dimension {
  id: IdDimension;
  /** Nombre que se muestra en los chips de filtro. */
  etiqueta: string;
  /** Código de la pregunta de origen. */
  pregunta: string;
  opciones: Opcion[];
  /** Valores de una respuesta en esta dimensión; `null` si no respondió la pregunta. */
  valores: (fila: Fila) => string[] | null;
}

export type Dimensiones = Record<IdDimension, Dimension>;

const simple = (v: string | null) => (v === null ? null : [v]);

/** Construye las dimensiones a partir de los catálogos del JSON. */
export function crearDimensiones(datos: DatosEncuesta): Dimensiones {
  const c = datos.catalogos;
  const dims: Partial<Dimensiones> = {
    funciones: { id: "funciones", etiqueta: "Tipo de funciones", pregunta: "P2", opciones: c.funciones, valores: (f) => [f.funciones] },
    uso: { id: "uso", etiqueta: "Uso de IA", pregunta: "P3", opciones: c.uso, valores: (f) => simple(f.uso) },
    frecuencia: { id: "frecuencia", etiqueta: "Frecuencia de uso", pregunta: "P4", opciones: c.frecuencia, valores: (f) => [f.frecuencia] },
    madurez: { id: "madurez", etiqueta: "Forma de uso", pregunta: "P7", opciones: c.madurez, valores: (f) => simple(f.madurez) },
    cambio: { id: "cambio", etiqueta: "Cambio en la forma de trabajar", pregunta: "P14", opciones: c.cambio, valores: (f) => [f.cambio] },
    claridad: { id: "claridad", etiqueta: "Claridad sobre orientaciones", pregunta: "P16", opciones: c.claridad, valores: (f) => simple(f.claridad) },
    nivel: { id: "nivel", etiqueta: "Nivel de apropiación", pregunta: "Índice", opciones: c.nivel, valores: (f) => [f.nivel] },
    herramientas: { id: "herramientas", etiqueta: "Herramienta", pregunta: "P5", opciones: c.herramientas, valores: (f) => f.herramientas },
    actividades: { id: "actividades", etiqueta: "Actividad", pregunta: "P6", opciones: c.actividades, valores: (f) => f.actividades },
    beneficios: { id: "beneficios", etiqueta: "Beneficio", pregunta: "P13", opciones: c.beneficios, valores: (f) => f.beneficios },
    barreras: { id: "barreras", etiqueta: "Dificultad", pregunta: "P15", opciones: c.barreras, valores: (f) => f.barreras },
    oportunidades: { id: "oportunidades", etiqueta: "Oportunidad", pregunta: "P17", opciones: c.oportunidades, valores: (f) => f.oportunidades },
    apoyos: { id: "apoyos", etiqueta: "Apoyo prioritario", pregunta: "P18", opciones: c.apoyos, valores: (f) => f.apoyos },
    temas: { id: "temas", etiqueta: "Tema de tarea repetitiva", pregunta: "P19", opciones: c.temas, valores: (f) => (f.tareaUtil ? f.temas : null) },
  };
  for (const comp of c.competencias) {
    const id = `comp_${comp.id}` as const;
    dims[id] = {
      id,
      etiqueta: comp.etiqueta,
      pregunta: comp.pregunta,
      opciones: c.nivelCompetencia,
      valores: (f) => {
        const v = f.comp[comp.id];
        return v === null ? null : [c.nivelCompetencia[v].id];
      },
    };
  }
  return dims as Dimensiones;
}

export type Filtros = Partial<Record<IdDimension, string[]>>;

/** Aplica los filtros (Y entre dimensiones, O dentro de una dimensión), omitiendo opcionalmente una dimensión. */
export function filtrarFilas(filas: Fila[], filtros: Filtros, dims: Dimensiones, excluir?: IdDimension): Fila[] {
  const activos = (Object.entries(filtros) as [IdDimension, string[]][]).filter(
    ([id, valores]) => id !== excluir && valores.length > 0 && dims[id],
  );
  if (activos.length === 0) return filas;
  return filas.filter((fila) =>
    activos.every(([id, seleccion]) => {
      const valores = dims[id].valores(fila);
      return valores !== null && valores.some((v) => seleccion.includes(v));
    }),
  );
}

/** Serializa los filtros a query string: `?funciones=profesionales,tecnicas&nivel=avanzado`. */
export function filtrosAQuery(filtros: Filtros): string {
  const params = new URLSearchParams();
  for (const [id, valores] of Object.entries(filtros)) {
    if (valores && valores.length > 0) params.set(id, valores.join(","));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Lee los filtros de la URL descartando dimensiones u opciones que no existen. */
export function queryAFiltros(search: string, dims: Dimensiones): Filtros {
  const params = new URLSearchParams(search);
  const filtros: Filtros = {};
  for (const [clave, valor] of params.entries()) {
    const dim = dims[clave as IdDimension];
    if (!dim) continue;
    const validos = valor.split(",").filter((v) => dim.opciones.some((o) => o.id === v));
    if (validos.length > 0) filtros[dim.id] = validos;
  }
  return filtros;
}
