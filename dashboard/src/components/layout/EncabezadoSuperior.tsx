"use client";

import { usePathname } from "next/navigation";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";
import { buscarVista, type Tema } from "@/lib/temas";

/**
 * Encabezado superior del layout interno: ruta de navegación, título de la vista y
 * logo institucional en la esquina superior derecha (regla de layouts §9, §10 y §18).
 * Tiene altura mínima fija para no saltar al cambiar de vista.
 *
 * @example
 * <EncabezadoSuperior tema={tema} />
 */
export function EncabezadoSuperior({ tema }: { tema: Tema }) {
  const pathname = usePathname();
  const vista = buscarVista(tema, pathname.split("/")[3] ?? "");

  return (
    <header className="flex min-h-[124px] items-start justify-between gap-4 border-b border-uc-border bg-uc-surface px-4 py-4 md:px-8">
      <div className="min-w-0">
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-uc-text-secondary">
            <li className="max-w-[48ch] truncate">{tema.nombre}</li>
            {vista && (
              <>
                <li aria-hidden>›</li>
                <li aria-current="page" className="font-medium text-uc-text">
                  {vista.nombre}
                </li>
              </>
            )}
          </ol>
        </nav>
        <h1 className="mt-1 text-2xl leading-tight font-bold text-uc-text md:text-[28px]">{vista?.nombre ?? tema.nombre}</h1>
        {vista && <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-uc-text-secondary">{vista.descripcion}</p>}
      </div>
      <LogoUcundinamarca variante="horizontal-negro" className="mt-1 h-10 w-auto shrink-0 md:h-12" />
    </header>
  );
}
