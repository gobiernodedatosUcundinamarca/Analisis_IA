/** Estado "Cargando vista" mientras se resuelve la navegación (regla de layouts §16). */
export default function CargandoVista() {
  return (
    <div role="status" aria-label="Cargando vista" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--chart-pista)]" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-[var(--chart-pista)]" />
    </div>
  );
}
