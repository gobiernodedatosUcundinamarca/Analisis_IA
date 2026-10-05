"use client";

import { ChartColumn, Funnel, MousePointerClick, Table2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { useDatos, useEncuesta } from "@/lib/encuesta/EncuestaProvider";
import { EstadoError, EstadoVacio, Esqueleto } from "@/components/ui/Estados";
import { DataTable, type Tabla } from "./DataTable";
import { Leyenda, type ItemLeyenda } from "./Leyenda";

/**
 * - `interactivo`: responde a los filtros y sus elementos filtran el tablero al hacer clic.
 * - `responde`: responde a los filtros, pero sus elementos no son seleccionables.
 * - `estatico`: análisis sobre la muestra completa; no cambia con los filtros.
 */
export type ModoGrafica = "interactivo" | "responde" | "estatico";

interface ChartCardProps {
  /** Título descriptivo: variable, unidad y población (regla de dashboard §1). */
  titulo: string;
  descripcion?: string;
  /** Códigos de las preguntas de origen (P1–P19); se muestran con su texto en el pie. */
  preguntas?: string[];
  modo: ModoGrafica;
  /** Número de respuestas que forman la base de los porcentajes. */
  n?: number;
  /** Sin datos para los filtros actuales. */
  vacio?: boolean;
  /** Vista de tabla equivalente (accesibilidad y lectura exacta de valores). */
  tabla?: Tabla;
  leyenda?: ItemLeyenda[];
  /** Nota metodológica breve bajo la gráfica. */
  nota?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Contenedor estándar de toda gráfica: título, insignias de estado (filtrado / muestra completa),
 * leyenda, alternancia gráfica↔tabla, estados de carga, error y vacío, y pie con la pregunta fuente.
 *
 * @example
 * <ChartCard titulo="Frecuencia de uso de IA (% de respuestas)" preguntas={["P4"]} modo="interactivo" n={226} tabla={tabla}>
 *   <ColumnChart items={items} />
 * </ChartCard>
 */
export function ChartCard({ titulo, descripcion, preguntas, modo, n, vacio, tabla, leyenda, nota, className = "", children }: ChartCardProps) {
  const { carga, reintentar, totalActivos, limpiar } = useEncuesta();
  const datos = useDatos();
  const [verTabla, setVerTabla] = useState(false);
  const idTitulo = useId();
  const filtrada = totalActivos > 0 && modo !== "estatico";
  const listo = carga.estado === "listo";

  let cuerpo: ReactNode;
  if (carga.estado === "cargando") cuerpo = <Esqueleto />;
  else if (carga.estado === "error") cuerpo = <EstadoError mensaje={carga.mensaje} onReintentar={reintentar} />;
  else if (vacio) cuerpo = <EstadoVacio onLimpiar={totalActivos > 0 ? limpiar : undefined} />;
  else if (verTabla && tabla) cuerpo = <DataTable titulo={titulo} {...tabla} />;
  else cuerpo = children;

  return (
    <section aria-labelledby={idTitulo} className={`flex min-w-0 flex-col rounded-2xl border border-uc-border bg-uc-surface p-4 md:p-5 ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1 basis-60">
          <h3 id={idTitulo} className="text-base leading-snug font-semibold text-uc-text md:text-[17px]">
            {titulo}
          </h3>
          {descripcion && <p className="mt-0.5 text-[13px] text-uc-text-secondary">{descripcion}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {filtrada && (
            <span className="inline-flex items-center gap-1 rounded-full border border-uc-green bg-[var(--chart-pista)] px-2 py-0.5 text-[11px] font-semibold text-uc-green-dark">
              <Funnel aria-hidden className="size-3" />
              Filtrada
            </span>
          )}
          {modo === "estatico" && (
            <span className="rounded-full border border-uc-border px-2 py-0.5 text-[11px] font-medium text-uc-text-secondary">
              Muestra completa · no cambia con filtros
            </span>
          )}
          {tabla && listo && !vacio && (
            <button
              type="button"
              aria-pressed={verTabla}
              onClick={() => setVerTabla((v) => !v)}
              className="inline-flex items-center gap-1 rounded-lg border border-uc-border px-2 py-1 text-xs font-medium text-uc-text hover:border-uc-green"
            >
              {verTabla ? <ChartColumn aria-hidden className="size-3.5" /> : <Table2 aria-hidden className="size-3.5" />}
              {verTabla ? "Ver gráfica" : "Ver tabla"}
            </button>
          )}
        </div>
      </header>

      {leyenda && listo && !vacio && !verTabla && <Leyenda items={leyenda} />}

      <div className="mt-3 min-w-0 flex-1">{cuerpo}</div>

      {(nota || preguntas || modo === "interactivo") && (
        <footer className="mt-4 space-y-1 border-t border-uc-border pt-2 text-xs text-uc-text-secondary">
          {modo === "interactivo" && listo && !vacio && (
            <p className="flex items-center gap-1">
              <MousePointerClick aria-hidden className="size-3.5" />
              Haga clic en un elemento para filtrar todo el tablero; vuelva a hacer clic para quitar el filtro.
            </p>
          )}
          {nota && <div>{nota}</div>}
          {preguntas && datos && (
            <ul>
              {preguntas.map((p) => (
                <li key={p}>
                  <span className="font-semibold">{p}</span>
                  {datos.datos.preguntas[p] ? ` · ${datos.datos.preguntas[p]}` : ""}
                </li>
              ))}
            </ul>
          )}
          {n !== undefined && listo && !vacio && <p>Base: {n} respuestas.</p>}
        </footer>
      )}
    </section>
  );
}
