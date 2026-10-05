"use client";

import { ChevronDown, Funnel, RotateCcw, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Dimension, IdDimension } from "@/lib/encuesta/dimensiones";
import { N_MINIMO, useDatos, useEncuesta, useFilas } from "@/lib/encuesta/EncuestaProvider";

/** Dimensiones que se ofrecen como filtros generales (el resto se activa haciendo clic en las gráficas). */
const FILTROS_GENERALES: IdDimension[] = ["funciones", "nivel", "frecuencia"];

/**
 * Barra de filtros generales, fija en la parte superior (regla de dashboard §4 y §6):
 * selectores por dimensión, chips de filtros activos (incluidos los aplicados desde las gráficas),
 * botón "Limpiar filtros", número de respuestas filtradas y aviso de muestra pequeña.
 *
 * @example
 * <BarraFiltros />
 */
export function BarraFiltros() {
  const { carga, filtros, quitar, limpiar, totalActivos } = useEncuesta();
  const datos = useDatos();
  const filas = useFilas();

  if (carga.estado !== "listo" || !datos) {
    return (
      <div className="sticky top-0 z-20 border-b border-uc-border bg-uc-surface/95 px-4 py-3 text-sm text-uc-text-secondary backdrop-blur md:px-8">
        {carga.estado === "error" ? "No fue posible cargar los filtros." : "Cargando datos de la encuesta…"}
      </div>
    );
  }

  const total = datos.datos.meta.respuestas;
  const chips = (Object.entries(filtros) as [IdDimension, string[]][]).flatMap(([id, valores]) =>
    valores.map((v) => ({ dim: datos.dims[id], valor: v })),
  );

  return (
    <div className="sticky top-0 z-20 border-b border-uc-border bg-uc-surface/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-uc-text">
          <Funnel aria-hidden className="size-4 text-uc-green" />
          Filtros
        </span>
        {FILTROS_GENERALES.map((id) => (
          <SelectorFiltro key={id} dim={datos.dims[id]} />
        ))}
        <button
          type="button"
          onClick={limpiar}
          disabled={totalActivos === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-uc-green-dark hover:bg-[var(--chart-pista)] disabled:cursor-not-allowed disabled:text-uc-text-secondary disabled:opacity-60 disabled:hover:bg-transparent"
        >
          <RotateCcw aria-hidden className="size-4" />
          Limpiar filtros
        </button>
        <p className="ml-auto text-sm text-uc-text-secondary" aria-live="polite">
          Mostrando <strong className="font-semibold text-uc-text">{filas.length}</strong> de {total} respuestas
        </p>
      </div>

      {chips.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Filtros activos">
          {chips.map(({ dim, valor }) => {
            const opcion = dim.opciones.find((o) => o.id === valor);
            return (
              <li key={`${dim.id}-${valor}`}>
                <button
                  type="button"
                  onClick={() => quitar(dim.id, valor)}
                  aria-label={`Quitar filtro ${dim.etiqueta}: ${opcion?.etiqueta ?? valor}`}
                  className="inline-flex items-center gap-1 rounded-full border border-uc-green bg-[var(--chart-pista)] py-0.5 pr-1.5 pl-2.5 text-xs text-uc-text hover:bg-uc-green hover:text-white"
                >
                  <span className="font-semibold">{dim.etiqueta}:</span> {opcion?.etiqueta ?? valor}
                  <X aria-hidden className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {totalActivos > 0 && filas.length > 0 && filas.length < N_MINIMO && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-uc-text">
          <TriangleAlert aria-hidden className="size-4 text-uc-gold" />
          Muestra pequeña ({filas.length} respuestas): los porcentajes cambian mucho con pocas personas; interprételos con cautela.
        </p>
      )}
    </div>
  );
}

function SelectorFiltro({ dim }: { dim: Dimension }) {
  const { filtros, alternar } = useEncuesta();
  const ref = useRef<HTMLDetailsElement>(null);
  const seleccion = filtros[dim.id] ?? [];

  useEffect(() => {
    const cerrarFuera = (e: PointerEvent) => {
      const el = ref.current;
      if (el?.open && !el.contains(e.target as Node)) el.open = false;
    };
    const cerrarEsc = (e: KeyboardEvent) => {
      const el = ref.current;
      if (e.key === "Escape" && el?.open) {
        el.open = false;
        el.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", cerrarFuera);
    document.addEventListener("keydown", cerrarEsc);
    return () => {
      document.removeEventListener("pointerdown", cerrarFuera);
      document.removeEventListener("keydown", cerrarEsc);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden ${
          seleccion.length > 0 ? "border-uc-green bg-[var(--chart-pista)] text-uc-green-dark" : "border-uc-border text-uc-text hover:border-uc-green"
        }`}
      >
        {dim.etiqueta}
        {seleccion.length > 0 && (
          <span className="rounded-full bg-uc-green px-1.5 text-xs font-semibold text-white">{seleccion.length}</span>
        )}
        <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <fieldset className="absolute left-0 z-40 mt-1 max-h-80 w-72 overflow-y-auto rounded-xl border border-uc-border bg-uc-surface p-2 shadow-lg">
        <legend className="sr-only">{dim.etiqueta}</legend>
        {dim.opciones.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[var(--chart-pista)]">
            <input
              type="checkbox"
              checked={seleccion.includes(o.id)}
              onChange={() => alternar(dim.id, o.id)}
              className="mt-1 size-4 accent-[var(--uc-green)]"
            />
            <span>{o.etiqueta}</span>
          </label>
        ))}
      </fieldset>
    </details>
  );
}
