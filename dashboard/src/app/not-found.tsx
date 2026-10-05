import { MapPinOff } from "lucide-react";
import Link from "next/link";

/** Ruta no encontrada (regla de layouts §16). */
export default function NoEncontrado() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <MapPinOff aria-hidden className="size-8 text-uc-green" />
      <h1 className="text-2xl font-bold text-uc-text">Página no encontrada</h1>
      <p className="max-w-md text-sm text-uc-text-secondary">La dirección no corresponde a ninguna vista del tablero.</p>
      <Link href="/" className="rounded-lg bg-uc-green px-4 py-2 text-sm font-semibold text-white hover:bg-uc-green-dark">
        Ir al tablero
      </Link>
    </main>
  );
}
