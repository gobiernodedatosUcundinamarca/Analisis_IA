"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

/** Estado "Error de carga" de una vista, con acción para reintentar (regla de layouts §16). */
export default function ErrorVista({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-uc-border bg-uc-surface px-4 py-12 text-center">
      <TriangleAlert aria-hidden className="size-8 text-uc-gold" />
      <h2 className="text-xl font-semibold text-uc-text">No fue posible mostrar esta vista</h2>
      <p className="max-w-md text-sm text-uc-text-secondary">Ocurrió un error inesperado. Puede reintentar o elegir otra vista en el menú.</p>
      <button type="button" onClick={() => retry()} className="inline-flex items-center gap-1.5 rounded-lg bg-uc-green px-4 py-2 text-sm font-semibold text-white hover:bg-uc-green-dark">
        <RefreshCw aria-hidden className="size-4" />
        Reintentar
      </button>
    </div>
  );
}
