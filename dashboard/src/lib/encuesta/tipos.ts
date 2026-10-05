/** Contrato del archivo `public/data/encuesta-ia.json` (generado por `scripts/generar_datos.py`). */

export interface Opcion {
  /** Identificador estable usado en filtros y en la URL. */
  id: string;
  /** Texto original de la encuesta. */
  texto: string;
  /** Etiqueta corta para gráficas. */
  etiqueta: string;
}

export type IdCompetencia = "instruccion" | "evaluar" | "analizar" | "limites" | "proteger";

export interface Competencia extends Opcion {
  id: IdCompetencia;
  /** Código de la pregunta (P8 a P12). */
  pregunta: string;
}

/** Una respuesta anonimizada; los valores son ids de los catálogos. `null` = pregunta sin responder. */
export interface Fila {
  id: number;
  funciones: string;
  uso: string | null;
  frecuencia: string;
  madurez: string | null;
  /** Nivel por competencia de 0 (Ninguna) a 4 (Muy alta). */
  comp: Record<IdCompetencia, number | null>;
  cambio: string;
  claridad: string | null;
  herramientas: string[] | null;
  actividades: string[] | null;
  beneficios: string[] | null;
  barreras: string[] | null;
  oportunidades: string[] | null;
  apoyos: string[] | null;
  /** La respuesta abierta (P19) describe una tarea concreta. */
  tareaUtil: boolean;
  temas: string[];
  /** Frecuencia de uso en escala 0 a 4. */
  frecuenciaN: number;
  /** Promedio de las 5 competencias (0 a 4). */
  compMedia: number;
  /** Actividades contadas para el índice (con tope 6 en la fórmula). */
  nActividades: number;
  /** Índice de apropiación 0 a 100. */
  indice: number;
  nivel: string;
}

export interface Catalogos {
  funciones: Opcion[];
  uso: Opcion[];
  frecuencia: Opcion[];
  madurez: Opcion[];
  nivelCompetencia: Opcion[];
  cambio: Opcion[];
  claridad: Opcion[];
  nivel: Opcion[];
  herramientas: Opcion[];
  actividades: Opcion[];
  beneficios: Opcion[];
  barreras: Opcion[];
  oportunidades: Opcion[];
  apoyos: Opcion[];
  temas: Opcion[];
  competencias: Competencia[];
  actividadesIndice: string[];
}

export interface DatosEncuesta {
  meta: {
    titulo: string;
    archivo: string;
    respuestas: number;
    inicio: string;
    fin: string;
    generado: string;
    duracionMin: { mediana: number; p25: number; p75: number; max: number };
    nulos: { pregunta: string; nulos: number }[];
    columnasDescartadas: string[];
  };
  /** Texto de cada pregunta, por código (P1 a P19). */
  preguntas: Record<string, string>;
  catalogos: Catalogos;
  filas: Fila[];
  estaticos: {
    unidades: { distintas: number; top: { unidad: string; n: number }[] };
    tareas: { respuestas: number; utiles: number; ejemplos: string[]; palabras: { palabra: string; n: number }[] };
    pruebas: {
      kruskalFunciones: { H: number; p: number; grupos: string[] };
      chi2NivelFunciones: { chi2: number; gl: number; p: number };
      spearmanIndiceClaridad: { rho: number; p: number; n: number };
      spearmanCompetenciasFrecuencia: { competencia: IdCompetencia; rho: number; p: number }[];
    };
  };
}
