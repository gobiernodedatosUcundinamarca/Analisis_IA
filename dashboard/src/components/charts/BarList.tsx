"use client";

import { Check } from "lucide-react";
import { SERIE_1 } from "@/lib/colores";
import { Tooltip } from "./Tooltip";

export interface ItemBarra {
  id: string;
  etiqueta: string;
  /** Valor que determina la longitud de la barra. */
  valor: number;
  /** Valor formateado que se muestra al final de la barra, p. ej. "75 %". */
  texto: string;
  /** Detalle del tooltip y de la etiqueta accesible, p. ej. "170 de 226 respuestas". */
  detalle?: string;
}

interface BarListProps {
  items: ItemBarra[];
  /** Máximo de la escala; por defecto el mayor valor (las barras se comparan entre sí). */
  maximo?: number;
  color?: string;
  /** Ids seleccionados como filtro. */
  seleccion?: string[];
  /** Si se indica, cada barra es un botón que filtra el tablero. */
  onSeleccionar?: (id: string) => void;
}

/**
 * Barras horizontales de una sola serie: etiqueta, barra (≤ 24 px, extremo redondeado de 4 px,
 * base recta) y valor al final. En móvil la etiqueta pasa arriba para no cortarse.
 *
 * @example
 * <BarList items={[{ id: "chatgpt", etiqueta: "ChatGPT", valor: 75.2, texto: "75 %" }]} onSeleccionar={alternar} seleccion={sel} />
 */
export function BarList({ items, maximo, color = SERIE_1, seleccion = [], onSeleccionar }: BarListProps) {
  const max = maximo ?? Math.max(1, ...items.map((i) => i.valor));
  const haySeleccion = seleccion.length > 0;

  return (
    <ul className="space-y-1">
      {items.map((it) => {
        const seleccionado = seleccion.includes(it.id);
        const atenuado = haySeleccion && !seleccionado;
        const ancho = Math.max(0, Math.min(100, (it.valor / max) * 100));
        const contenido = (
          <>
            <span className={`col-start-1 row-start-1 flex items-start gap-1 text-left text-sm leading-snug ${seleccionado ? "font-semibold" : ""}`}>
              {seleccionado && <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-uc-green-dark" strokeWidth={3} />}
              {it.etiqueta}
            </span>
            <span className="relative col-span-2 row-start-2 h-4 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <span className="absolute inset-0 rounded-r-[4px] bg-[var(--chart-pista)]" />
              <span className="absolute inset-y-0 left-0 rounded-r-[4px]" style={{ width: `${ancho}%`, background: color }} />
            </span>
            <span className="cifras-tabulares col-start-2 row-start-1 text-right text-sm font-semibold text-uc-text sm:col-start-3">{it.texto}</span>
            {it.detalle && <Tooltip>{`${it.etiqueta}: ${it.texto} · ${it.detalle}`}</Tooltip>}
          </>
        );
        const clases = `group relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-lg px-2 py-1.5 sm:grid-cols-[minmax(8rem,38%)_minmax(0,1fr)_4.5rem] transition-opacity ${
          atenuado ? "opacity-40" : ""
        } ${seleccionado ? "bg-[var(--chart-pista)] outline-2 outline-uc-green-dark" : ""}`;

        return (
          <li key={it.id}>
            {onSeleccionar ? (
              <button
                type="button"
                aria-pressed={seleccionado}
                aria-label={`${it.etiqueta}: ${it.texto}${it.detalle ? `, ${it.detalle}` : ""}. ${seleccionado ? "Quitar filtro" : "Filtrar por esta opción"}`}
                onClick={() => onSeleccionar(it.id)}
                className={`${clases} cursor-pointer hover:bg-[var(--chart-pista)]`}
              >
                {contenido}
              </button>
            ) : (
              <div className={clases}>{contenido}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
