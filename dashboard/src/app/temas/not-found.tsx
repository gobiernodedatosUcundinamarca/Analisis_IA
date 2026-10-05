import { FolderX } from "lucide-react";
import Link from "next/link";

/** Tema no encontrado (regla de layouts §16): se muestra cuando el `temaId` de la ruta no existe. */
export default function TemaNoEncontrado() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <FolderX aria-hidden className="size-8 text-uc-green" />
      <h1 className="text-2xl font-bold text-uc-text">Tema no encontrado</h1>
      <p className="max-w-md text-sm text-uc-text-secondary">El tema solicitado no existe o ya no está publicado.</p>
      <Link href="/" className="rounded-lg bg-uc-green px-4 py-2 text-sm font-semibold text-white hover:bg-uc-green-dark">
        Ir al tablero
      </Link>
    </main>
  );
}
