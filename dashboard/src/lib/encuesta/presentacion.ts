/** Conversión de agregados a las estructuras que consumen las gráficas, tablas y KPIs. */
import type { ItemBarra } from "@/components/charts/BarList";
import type { Tabla } from "@/components/charts/DataTable";
import { pct } from "@/lib/formato";
import { proporcion, type Distribucion, type ItemDistribucion } from "./agregaciones";
import type { Fila } from "./tipos";

/** Opciones que se muestran al final aunque no sean las menores (respuestas residuales o de "no uso"). */
const AL_FINAL = ["otra", "ninguna", "no_usa", "sin_beneficios"];

/** Ordena de mayor a menor dejando al final las opciones residuales. */
export function ordenarDesc(items: ItemDistribucion[]): ItemDistribucion[] {
  return [...items].sort((a, b) => {
    const fa = AL_FINAL.includes(a.id) ? 1 : 0;
    const fb = AL_FINAL.includes(b.id) ? 1 : 0;
    return fa - fb || b.pct - a.pct;
  });
}

export function itemsBarra(items: ItemDistribucion[], n: number, decimales = 0): ItemBarra[] {
  return items.map((i) => ({
    id: i.id,
    etiqueta: i.etiqueta,
    valor: i.pct,
    texto: pct(i.pct, decimales),
    detalle: `${i.conteo} de ${n} respuestas`,
  }));
}

/** Tabla equivalente con el texto original de cada opción. */
export function tablaDistribucion(d: Distribucion, items = d.items): Tabla {
  return {
    columnas: ["Opción (texto de la encuesta)", "% de respuestas", "Personas"],
    filas: items.map((i) => [i.texto, pct(i.pct, 1), i.conteo]),
  };
}

export interface DatoKpi {
  valor: string;
  detalle: string;
  comparacion: { actual: number; total: number };
}

/** KPI de proporción sobre las respuestas filtradas, comparado con la muestra completa. */
export function kpiProporcion(filas: Fila[], todas: Fila[], condicion: (f: Fila) => boolean | null): DatoKpi {
  const actual = proporcion(filas, condicion);
  const total = proporcion(todas, condicion);
  return {
    valor: pct(actual.pct),
    detalle: `${actual.conteo} de ${actual.n} respuestas`,
    comparacion: { actual: actual.pct, total: total.pct },
  };
}
