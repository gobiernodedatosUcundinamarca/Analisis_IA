"use client";

import { Check } from "lucide-react";
import { SERIE_1 } from "@/lib/colores";
import { Tooltip } from "./Tooltip";

export interface ItemColumna {
  id: string;
  etiqueta: string;
  valor: number;
  /** Valor formateado sobre la columna. */
  texto: string;
  detalle?: string;
  /** Color propio (p. ej. paso de una escala ordinal); por defecto el de la serie. */
  color?: string;
}

interface ColumnChartProps {
  items: ItemColumna[];
  maximo?: number;
  color?: string;
  /** Alto del área de trazado en píxeles (las etiquetas del eje van debajo y no se recortan). */
  alto?: number;
  /** Nombre del eje horizontal. */
  ejeX?: string;
  seleccion?: string[];
  onSeleccionar?: (id: string) => void;
}

/**
 * Columnas verticales para categorías ordenadas (frecuencia, niveles).
 * Columnas de máximo 24 px con tapa redondeada de 4 px y valor sobre la tapa.
 *
 * @example
 * <ColumnChart items={items} ejeX="Frecuencia de uso" onSeleccionar={alternar} seleccion={sel} />
 */
export function ColumnChart({ items, maximo, color = SERIE_1, alto = 190, ejeX, seleccion = [], onSeleccionar }: ColumnChartProps) {
  const max = maximo ?? Math.max(1, ...items.map((i) => i.valor));
  const haySeleccion = seleccion.length > 0;
  const altoBarras = alto - 24;

  return (
    <figure className="w-full">
      <div className="relative flex items-end border-b border-uc-border" style={{ height: alto }}>
        {items.map((it) => {
          const seleccionado = seleccion.includes(it.id);
          const atenuado = haySeleccion && !seleccionado;
          const h = Math.max(it.valor > 0 ? 2 : 0, (it.valor / max) * altoBarras);
          const columna = (
            <>
              <span className="cifras-tabulares mb-1 text-xs font-semibold whitespace-nowrap text-uc-text">{it.texto}</span>
              <span
                className={`block w-full max-w-6 rounded-t-[4px] ${seleccionado ? "outline-2 outline-offset-2 outline-uc-green-dark" : ""}`}
                style={{ height: h, background: it.color ?? color }}
              />
              {it.detalle && <Tooltip>{`${it.etiqueta}: ${it.texto} · ${it.detalle}`}</Tooltip>}
            </>
          );
          const clases = `group relative flex h-full flex-1 flex-col items-center justify-end px-1 transition-opacity ${atenuado ? "opacity-40" : ""}`;
          return onSeleccionar ? (
            <button
              key={it.id}
              type="button"
              aria-pressed={seleccionado}
              aria-label={`${it.etiqueta}: ${it.texto}${it.detalle ? `, ${it.detalle}` : ""}. ${seleccionado ? "Quitar filtro" : "Filtrar por esta opción"}`}
              onClick={() => onSeleccionar(it.id)}
              className={`${clases} cursor-pointer rounded-t-md hover:bg-[var(--chart-pista)]`}
            >
              {columna}
            </button>
          ) : (
            <div key={it.id} className={clases}>
              {columna}
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex">
        {items.map((it) => {
          const seleccionado = seleccion.includes(it.id);
          return (
            <span
              key={it.id}
              className={`flex flex-1 justify-center gap-0.5 px-1 text-center text-xs leading-tight ${seleccionado ? "font-semibold text-uc-text" : "text-uc-text-secondary"}`}
            >
              {seleccionado && <Check aria-hidden className="size-3.5 shrink-0 text-uc-green-dark" strokeWidth={3} />}
              {it.etiqueta}
            </span>
          );
        })}
      </div>
      {ejeX && <figcaption className="mt-2 text-center text-xs text-uc-text-secondary">{ejeX}</figcaption>}
    </figure>
  );
}
