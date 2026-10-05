"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEncuesta } from "@/lib/encuesta/EncuestaProvider";
import { pp } from "@/lib/formato";
import { Esqueleto } from "./Estados";

interface KpiCardProps {
  /** Nombre del indicador (sin dos puntos finales). */
  etiqueta: string;
  /** Valor ya formateado, p. ej. "96,4 %". */
  valor: string;
  /** Línea de apoyo, p. ej. "217 de 225 respuestas". */
  detalle?: string;
  /** Pregunta(s) de origen, p. ej. "P3". */
  pregunta?: string;
  /**
   * Valor actual y valor de la muestra completa en %, para mostrar la variación cuando hay filtros.
   * Al ser la primera medición, la referencia es el total de la encuesta y no un periodo anterior.
   */
  comparacion?: { actual: number; total: number };
  /** Unidad de la variación: puntos porcentuales (por defecto) o puntos de un índice. */
  unidadDelta?: "pp" | "puntos";
  icono?: ReactNode;
}

/**
 * Tarjeta de indicador clave (regla de dashboard §5).
 *
 * @example
 * <KpiCard etiqueta="Ha usado IA en su trabajo" valor="96,4 %" detalle="217 de 225" pregunta="P3" />
 */
export function KpiCard({ etiqueta, valor, detalle, pregunta, comparacion, unidadDelta = "pp", icono }: KpiCardProps) {
  const { carga, totalActivos } = useEncuesta();
  const diferencia = comparacion ? comparacion.actual - comparacion.total : 0;
  const mostrarDelta = comparacion && totalActivos > 0 && Number.isFinite(diferencia);
  const Flecha = diferencia > 0.05 ? ArrowUpRight : diferencia < -0.05 ? ArrowDownRight : ArrowRight;

  return (
    <article className="flex flex-col rounded-2xl border border-uc-border bg-uc-surface p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[13px] leading-snug font-medium text-uc-text-secondary">{etiqueta}</h3>
        {icono && <span className="text-uc-green">{icono}</span>}
      </div>
      {carga.estado === "listo" ? (
        <>
          <p className="mt-2 text-[32px] leading-none font-semibold text-uc-text">{valor}</p>
          {detalle && <p className="mt-2 text-xs text-uc-text-secondary">{detalle}</p>}
          {mostrarDelta && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-uc-text">
              <Flecha aria-hidden className="size-3.5" />
              {unidadDelta === "pp" ? pp(diferencia) : `${pp(diferencia).replace(" pp", "")} puntos`} frente al total de la encuesta
            </p>
          )}
        </>
      ) : (
        <Esqueleto className="mt-3 h-12" />
      )}
      {pregunta && <p className="mt-auto pt-3 text-[11px] font-medium text-uc-text-secondary">Fuente: {pregunta}</p>}
    </article>
  );
}

/** Fila responsiva de 3 a 6 KPIs: 1 columna en móvil, 2 en tableta y 4 en escritorio. */
export function FilaKpis({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
