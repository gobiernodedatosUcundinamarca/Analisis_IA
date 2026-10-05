import { notFound } from "next/navigation";
import { BarraFiltros } from "@/components/layout/BarraFiltros";
import { EncabezadoSuperior } from "@/components/layout/EncabezadoSuperior";
import { MenuLateralFijo } from "@/components/layout/MenuLateralFijo";
import { EncuestaProvider } from "@/lib/encuesta/EncuestaProvider";
import { buscarTema, TEMAS } from "@/lib/temas";

export function generateStaticParams() {
  return TEMAS.map((t) => ({ temaId: t.id }));
}

/**
 * Layout 2 (navegación interna): menú lateral fijo, encabezado con logo a la derecha,
 * barra de filtros y contenido de la vista. Los datos y filtros viven aquí para conservarse entre vistas.
 */
export default async function LayoutTema({ children, params }: LayoutProps<"/temas/[temaId]">) {
  const { temaId } = await params;
  const tema = buscarTema(temaId);
  if (!tema) notFound();

  return (
    <EncuestaProvider fuente={tema.fuenteDatos}>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-uc-green px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <div className="min-h-dvh md:grid md:grid-cols-[88px_minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <MenuLateralFijo tema={tema} />
        <div className="flex min-w-0 flex-col pb-20 md:pb-0">
          <EncabezadoSuperior tema={tema} />
          <BarraFiltros />
          <main id="contenido" className="flex-1 px-4 py-6 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </EncuestaProvider>
  );
}
