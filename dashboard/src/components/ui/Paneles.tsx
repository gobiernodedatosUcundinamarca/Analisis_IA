"use client";

import { BookOpenText, ChevronDown, Info } from "lucide-react";
import type { ReactNode } from "react";
import { useEncuesta } from "@/lib/encuesta/EncuestaProvider";

/**
 * Explicación de los resultados de una vista. El texto describe la muestra completa;
 * si hay filtros activos, lo advierte para que no se confunda con las cifras filtradas.
 *
 * @example
 * <PanelLectura><p>La adopción básica es alta…</p></PanelLectura>
 */
export function PanelLectura({ titulo = "Conclusiones del apartado", children }: { titulo?: string; children: ReactNode }) {
  const { totalActivos } = useEncuesta();
  return (
    <section className="rounded-2xl border border-uc-border border-l-4 border-l-uc-green bg-uc-surface p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-uc-text">
        <BookOpenText aria-hidden className="size-5 text-uc-green" />
        {titulo}
      </h2>
      <div className="mt-2 space-y-2 text-[15px] text-uc-text [&_strong]:font-semibold">{children}</div>
      <p className="mt-3 flex items-start gap-1.5 text-xs text-uc-text-secondary">
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        {totalActivos > 0
          ? "Hay filtros activos: las cifras de este texto corresponden a la muestra completa (226 respuestas) y pueden diferir de las gráficas filtradas."
          : "Las cifras de este texto corresponden a la muestra completa (226 respuestas)."}
      </p>
    </section>
  );
}

/**
 * Bloque desplegable con una explicación metodológica (abierto por defecto para presentar).
 *
 * @example
 * <Explicacion titulo="¿Cómo se calcula el índice?">…</Explicacion>
 */
export function Explicacion({ titulo, children, abierta = true }: { titulo: string; children: ReactNode; abierta?: boolean }) {
  return (
    <details open={abierta} className="group rounded-2xl border border-uc-border bg-uc-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-lg font-semibold text-uc-text [&::-webkit-details-marker]:hidden">
        {titulo}
        <ChevronDown aria-hidden className="size-5 shrink-0 text-uc-green transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-uc-border px-5 py-4 text-[15px] text-uc-text [&_strong]:font-semibold [&_table]:w-full [&_td]:border-t [&_td]:border-uc-border [&_td]:px-2 [&_td]:py-1.5 [&_td]:align-top [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-uc-text-secondary">
        {children}
      </div>
    </details>
  );
}
