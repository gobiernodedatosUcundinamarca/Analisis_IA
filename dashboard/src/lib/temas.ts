/**
 * Catálogo de temas y vistas de la aplicación. La raíz `/` abre la primera vista del primer tema
 * (sin portada, por decisión del usuario; ver ADR 0005).
 *
 * Para agregar una vista basta con extender este catálogo y crear la carpeta física
 * de la vista en `src/app/temas/[temaId]/<vista>/` (regla de scaffolding por vistas).
 */

/** Clave del ícono de cada vista; el menú la traduce a un componente de `lucide-react`. */
export type IconoVista = "resumen" | "uso" | "barreras" | "metodologia";

export interface Vista {
  /** Segmento de ruta: `/temas/<tema>/<id>`. */
  id: string;
  nombre: string;
  /** Etiqueta breve para el menú compacto (tableta y móvil). */
  corto: string;
  descripcion: string;
  icono: IconoVista;
}

export interface Tema {
  id: string;
  nombre: string;
  descripcion: string;
  /** Fecha ISO de la última actualización de los datos. */
  actualizado: string;
  estado: "Publicado" | "En construcción";
  respuestas: number;
  /** Ruta pública del JSON con los datos del tema. */
  fuenteDatos: string;
  vistas: Vista[];
}

export const TEMAS: Tema[] = [
  {
    id: "diagnostico-ia",
    nombre: "Diagnóstico de uso de IA en el personal administrativo",
    descripcion: "Uso, competencias, barreras y oportunidades para incorporar la IA en los procesos institucionales.",
    actualizado: "2026-09-28",
    estado: "Publicado",
    respuestas: 226,
    fuenteDatos: "/data/encuesta-ia.json",
    vistas: [
      {
        id: "resumen",
        nombre: "Síntesis del diagnóstico",
        corto: "Síntesis",
        icono: "resumen",
        descripcion: "Indicadores clave y principales hallazgos del diagnóstico.",
      },
      {
        id: "uso",
        nombre: "Nivel de uso y competencias",
        corto: "Uso",
        icono: "uso",
        descripcion: "Frecuencia y tipo de uso de la IA, herramientas empleadas y competencias autopercibidas.",
      },
      {
        id: "barreras",
        nombre: "Brechas y requerimientos",
        corto: "Brechas",
        icono: "barreras",
        descripcion: "Barreras para el uso de la IA, oportunidades de aplicación y apoyos requeridos.",
      },
      {
        id: "metodologia",
        nombre: "Metodología y ficha técnica",
        corto: "Metodología",
        icono: "metodologia",
        descripcion: "Ficha técnica de la encuesta, preguntas aplicadas y cálculo del índice de apropiación.",
      },
    ],
  },
];

export function buscarTema(id: string): Tema | undefined {
  return TEMAS.find((t) => t.id === id);
}

export function buscarVista(tema: Tema, vistaId: string): Vista | undefined {
  return tema.vistas.find((v) => v.id === vistaId);
}
