import type { ReactNode } from "react";

/**
 * Tooltip de solo CSS: aparece al pasar el cursor o al enfocar con teclado el elemento padre,
 * que debe tener la clase `group` y posición relativa. Complementa, nunca reemplaza,
 * las etiquetas visibles y la vista de tabla.
 */
export function Tooltip({ children, alineacion = "centro" }: { children: ReactNode; alineacion?: "centro" | "izquierda" | "derecha" }) {
  const posicion =
    alineacion === "izquierda" ? "left-0" : alineacion === "derecha" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute bottom-full z-30 mb-2 hidden w-max max-w-[16rem] rounded-md bg-uc-text px-2 py-1 text-left text-xs leading-snug font-medium text-white shadow-lg group-hover:block group-focus-visible:block ${posicion}`}
    >
      {children}
    </span>
  );
}
