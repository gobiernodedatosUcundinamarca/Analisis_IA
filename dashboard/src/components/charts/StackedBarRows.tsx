"use client";

import { Check } from "lucide-react";
import { pct } from "@/lib/formato";
import { Tooltip } from "./Tooltip";

export interface SegmentoApilado {
  id: string;
  etiqueta: string;
  /** Porcentaje de la fila (0–100). */
  valor: number;
  conteo: number;
}

export interface FilaApilada {
  id: string;
  etiqueta: string;
  n: number;
  segmentos: SegmentoApilado[];
}

interface StackedBarRowsProps {
  filas: FilaApilada[];
  /** Color de cada segmento según su posición (escala ordinal). */
  colores: string[];
  /** Color de texto legible sobre cada color de segmento. */
  textos: string[];
  /** Si se indica, cada segmento es un botón que filtra el tablero. */
  onSeleccionar?: (filaId: string, segmentoId: string) => void;
  estaSeleccionado?: (filaId: string, segmentoId: string) => boolean;
  /** Indica si la fila tiene alguna selección activa (para atenuar los segmentos no elegidos). */
  filaConSeleccion?: (filaId: string) => boolean;
}

/** Ancho mínimo (en % de la fila) para escribir el valor dentro del segmento sin recortarlo. */
const MINIMO_ETIQUETA = 9;

/**
 * Barras 100 % apiladas por fila, con 2 px de separación entre segmentos. Los valores se escriben
 * dentro del segmento solo cuando caben; el resto queda en el tooltip y en la vista de tabla.
 *
 * @example
 * <StackedBarRows filas={filas} colores={ESCALA_5} textos={TEXTO_ESCALA_5} />
 */
export function StackedBarRows({ filas, colores, textos, onSeleccionar, estaSeleccionado, filaConSeleccion }: StackedBarRowsProps) {
  return (
    <ul className="space-y-4">
      {filas.map((fila) => {
        const conSeleccion = filaConSeleccion?.(fila.id) ?? false;
        return (
          <li key={fila.id}>
            <p className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
              <span className="font-medium text-uc-text">{fila.etiqueta}</span>
              <span className="text-xs text-uc-text-secondary">n = {fila.n}</span>
            </p>
            <div className="flex h-8 w-full gap-[2px]">
              {fila.segmentos.map((s, i) => {
                if (s.valor <= 0) return null;
                const seleccionado = estaSeleccionado?.(fila.id, s.id) ?? false;
                const atenuado = conSeleccion && !seleccionado;
                const etiquetaAccesible = `${fila.etiqueta} · ${s.etiqueta}: ${pct(s.valor)} (${s.conteo} de ${fila.n})`;
                const clases = `group relative flex h-full min-w-[3px] items-center justify-center transition-opacity first:rounded-l-[4px] last:rounded-r-[4px] ${
                  atenuado ? "opacity-35" : ""
                } ${seleccionado ? "outline-2 outline-offset-1 outline-uc-text" : ""}`;
                const contenido = (
                  <>
                    {s.valor >= MINIMO_ETIQUETA && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: textos[i] }}>
                        {seleccionado && <Check aria-hidden className="size-3" strokeWidth={3} />}
                        {pct(s.valor, 0)}
                      </span>
                    )}
                    <Tooltip alineacion={i === 0 ? "izquierda" : i === fila.segmentos.length - 1 ? "derecha" : "centro"}>
                      {etiquetaAccesible}
                    </Tooltip>
                  </>
                );
                const estilo = { flexBasis: `${s.valor}%`, background: colores[i] };
                return onSeleccionar ? (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={seleccionado}
                    aria-label={`${etiquetaAccesible}. ${seleccionado ? "Quitar filtro" : "Filtrar por esta opción"}`}
                    onClick={() => onSeleccionar(fila.id, s.id)}
                    className={`${clases} cursor-pointer`}
                    style={estilo}
                  >
                    {contenido}
                  </button>
                ) : (
                  <div key={s.id} className={clases} style={estilo} tabIndex={0} role="img" aria-label={etiquetaAccesible}>
                    {contenido}
                  </div>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
