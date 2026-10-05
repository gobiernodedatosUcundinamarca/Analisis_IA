"use client";

import { CircleSlash, RefreshCw, TriangleAlert } from "lucide-react";

/** Bloque gris animado mientras cargan los datos. */
export function Esqueleto({ className = "h-40" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-[var(--chart-pista)] ${className}`} />;
}

/** Mensaje cuando los filtros no dejan respuestas (regla de dashboard §4). */
export function EstadoVacio({ onLimpiar }: { onLimpiar?: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-uc-text-secondary">
      <CircleSlash aria-hidden className="size-6 text-uc-text-secondary" />
      <p>No existen datos para los filtros seleccionados.</p>
      {onLimpiar && (
        <button type="button" onClick={onLimpiar} className="rounded-lg border border-uc-green px-3 py-1.5 font-medium text-uc-green-dark hover:bg-[var(--chart-pista)]">
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

/** Mensaje de error de carga con acción para reintentar (regla de dashboard §9). */
export function EstadoError({ mensaje, onReintentar }: { mensaje?: string; onReintentar: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-uc-text">
      <TriangleAlert aria-hidden className="size-6 text-uc-gold" />
      <p className="font-medium">No fue posible cargar los datos de la encuesta.</p>
      {mensaje && <p className="text-xs text-uc-text-secondary">Detalle: {mensaje}</p>}
      <button type="button" onClick={onReintentar} className="inline-flex items-center gap-1.5 rounded-lg bg-uc-green px-3 py-1.5 font-medium text-white hover:bg-uc-green-dark">
        <RefreshCw aria-hidden className="size-4" />
        Reintentar
      </button>
    </div>
  );
}
