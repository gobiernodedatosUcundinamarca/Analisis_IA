"use client";

import { Activity, Database, LayoutDashboard, ShieldAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";
import { useEncuesta } from "@/lib/encuesta/EncuestaProvider";
import type { IconoVista, Tema } from "@/lib/temas";

const ICONOS: Record<IconoVista, LucideIcon> = {
  resumen: LayoutDashboard,
  uso: Activity,
  barreras: ShieldAlert,
  metodologia: Database,
};

/**
 * Menú lateral fijo, visible y no colapsable (regla de layouts §8).
 * - Escritorio (≥1024 px): 250 px con imagotipo horizontal blanco y etiquetas completas.
 * - Tableta (768–1023 px): barra compacta de 88 px con imagotipo vertical e íconos con etiqueta breve.
 * - Móvil (<768 px): navegación inferior persistente (sin menú hamburguesa).
 * Los enlaces conservan los filtros activos en la URL.
 *
 * @example
 * <MenuLateralFijo tema={tema} />
 */
export function MenuLateralFijo({ tema }: { tema: Tema }) {
  const pathname = usePathname();
  const { query } = useEncuesta();
  const base = `/temas/${tema.id}`;
  const esActiva = (vistaId: string) => pathname === `${base}/${vistaId}`;

  return (
    <>
      <aside
        aria-label="Vistas del tema"
        className="sticky top-0 hidden h-dvh flex-col overflow-y-auto bg-uc-green-dark md:flex md:w-[88px] md:px-2 md:py-4 lg:w-[250px] lg:px-4 lg:py-[22px]"
      >
        <div className="flex justify-center pb-6 lg:pt-3 lg:pb-8">
          <LogoUcundinamarca variante="horizontal-blanco" className="hidden h-[90px] w-[90%] lg:block" priority />
          <LogoUcundinamarca variante="vertical-blanco" className="h-14 w-auto lg:hidden" priority />
        </div>

        <p className="mb-1 hidden px-3 text-[13px] leading-snug font-semibold text-white lg:block">{tema.nombre}</p>
        <p className="mb-2 px-1 text-[11px] font-medium tracking-wide text-white/60 lg:px-3">Vistas</p>

        <nav>
          <ul className="flex flex-col gap-[3px]">
            {tema.vistas.map((vista, i) => {
              const Icono = ICONOS[vista.icono];
              const activa = esActiva(vista.id);
              return (
                <li key={vista.id}>
                  <Link
                    href={`${base}/${vista.id}${query}`}
                    aria-current={activa ? "page" : undefined}
                    title={`${i + 1}. ${vista.nombre}`}
                    className={`relative flex items-center rounded-[11px] transition-colors md:flex-col md:gap-1 md:px-1 md:py-2 md:text-center lg:flex-row lg:gap-3 lg:px-3 lg:py-[11px] lg:text-left ${
                      activa
                        ? "bg-white/12 font-semibold text-white before:absolute before:top-2 before:bottom-2 before:left-0 before:w-[3px] before:rounded-full before:bg-uc-yellow"
                        : "font-medium text-white/82 hover:bg-white/8"
                    }`}
                  >
                    <Icono aria-hidden className={`size-[18px] shrink-0 ${activa ? "opacity-100" : "opacity-80"}`} />
                    <span className="hidden text-sm lg:inline">
                      {i + 1}. {vista.nombre}
                    </span>
                    <span className="text-[11px] leading-tight lg:hidden">{vista.corto}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <nav
        aria-label="Vistas del tema"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-uc-green-dark md:hidden"
      >
        <ul className="flex overflow-x-auto">
          {tema.vistas.map((vista) => {
            const Icono = ICONOS[vista.icono];
            const activa = esActiva(vista.id);
            return (
              <li key={vista.id} className="shrink-0">
                <Link
                  href={`${base}/${vista.id}${query}`}
                  aria-current={activa ? "page" : undefined}
                  className={`relative flex w-[76px] flex-col items-center gap-1 px-1 py-2 text-center text-[11px] leading-tight ${
                    activa
                      ? "bg-white/12 font-semibold text-white before:absolute before:inset-x-3 before:top-0 before:h-[3px] before:rounded-full before:bg-uc-yellow"
                      : "font-medium text-white/82"
                  }`}
                >
                  <Icono aria-hidden className={`size-[18px] ${activa ? "opacity-100" : "opacity-80"}`} />
                  {vista.corto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
