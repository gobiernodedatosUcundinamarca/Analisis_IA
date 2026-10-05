/**
 * Cálculos puros sobre las respuestas filtradas. Los porcentajes usan como denominador
 * las personas que respondieron cada pregunta (las preguntas sin respuesta no cuentan).
 */
import type { Dimension } from "./dimensiones";
import type { Fila } from "./tipos";

export interface ItemDistribucion {
  id: string;
  etiqueta: string;
  texto: string;
  conteo: number;
  /** Porcentaje de 0 a 100 sobre `n`. */
  pct: number;
}

export interface Distribucion {
  /** Personas que respondieron la pregunta. */
  n: number;
  items: ItemDistribucion[];
}

/** Conteo y porcentaje por opción, en el orden del catálogo. En selección múltiple los % suman más de 100. */
export function distribucion(filas: Fila[], dim: Dimension, omitir: string[] = []): Distribucion {
  const conteos = new Map<string, number>();
  let n = 0;
  for (const fila of filas) {
    const valores = dim.valores(fila);
    if (valores === null) continue;
    n++;
    for (const v of valores) conteos.set(v, (conteos.get(v) ?? 0) + 1);
  }
  const items = dim.opciones
    .filter((o) => !omitir.includes(o.id))
    .map((o) => {
      const conteo = conteos.get(o.id) ?? 0;
      return { id: o.id, etiqueta: o.etiqueta, texto: o.texto, conteo, pct: n ? (conteo / n) * 100 : 0 };
    });
  return { n, items };
}

export interface Proporcion {
  conteo: number;
  n: number;
  pct: number;
}

/** Proporción de respuestas que cumplen `condicion`; `null` excluye la respuesta del denominador. */
export function proporcion(filas: Fila[], condicion: (f: Fila) => boolean | null): Proporcion {
  let conteo = 0;
  let n = 0;
  for (const f of filas) {
    const r = condicion(f);
    if (r === null) continue;
    n++;
    if (r) conteo++;
  }
  return { conteo, n, pct: n ? (conteo / n) * 100 : NaN };
}

export function media(valores: number[]): number {
  return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : NaN;
}
