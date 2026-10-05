"use client";

import { ChartCard } from "@/components/charts/ChartCard";
import { StackedBarRows, type FilaApilada } from "@/components/charts/StackedBarRows";
import { ESCALA_5, TEXTO_ESCALA_5 } from "@/lib/colores";
import { distribucion } from "@/lib/encuesta/agregaciones";
import { filtrarFilas, type IdDimension } from "@/lib/encuesta/dimensiones";
import { useDatos, useEncuesta } from "@/lib/encuesta/EncuestaProvider";
import { pct } from "@/lib/formato";

const dimDe = (competencia: string) => `comp_${competencia}` as IdDimension;

/**
 * Las 5 competencias autopercibidas como barras 100 % apiladas por nivel (Ninguna → Muy alta).
 * Cada fila ignora el filtro de su propia competencia para seguir mostrando todos los niveles,
 * y cada segmento filtra el tablero por ese nivel de esa competencia.
 */
export function CompetenciasApiladas() {
  const datos = useDatos();
  const { filtros, alternar } = useEncuesta();

  const filas: FilaApilada[] = [];
  if (datos) {
    for (const c of datos.datos.catalogos.competencias) {
      const id = dimDe(c.id);
      const d = distribucion(filtrarFilas(datos.datos.filas, filtros, datos.dims, id), datos.dims[id]);
      filas.push({
        id: c.id,
        etiqueta: `${c.etiqueta} (${c.pregunta})`,
        n: d.n,
        segmentos: d.items.map((i) => ({ id: i.id, etiqueta: i.etiqueta, valor: i.pct, conteo: i.conteo })),
      });
    }
  }
  const niveles = datos?.datos.catalogos.nivelCompetencia ?? [];
  const vacio = filas.length > 0 && filas.every((f) => f.n === 0);
  const seleccion = (competencia: string) => filtros[dimDe(competencia)] ?? [];

  return (
    <ChartCard
      titulo="Autopercepción de competencias en el uso de IA (% de respuestas por nivel)"
      preguntas={["P8", "P9", "P10", "P11", "P12"]}
      modo="interactivo"
      vacio={vacio}
      leyenda={niveles.map((nv, i) => ({ etiqueta: nv.etiqueta, color: ESCALA_5[i] }))}
      tabla={{
        columnas: ["Competencia", ...niveles.map((nv) => nv.etiqueta), "Base"],
        filas: filas.map((f) => [f.etiqueta, ...f.segmentos.map((s) => pct(s.valor, 1)), f.n]),
      }}
    >
      <StackedBarRows
        filas={filas}
        colores={ESCALA_5}
        textos={TEXTO_ESCALA_5}
        onSeleccionar={(competencia, nivel) => alternar(dimDe(competencia), nivel)}
        estaSeleccionado={(competencia, nivel) => seleccion(competencia).includes(nivel)}
        filaConSeleccion={(competencia) => seleccion(competencia).length > 0}
      />
    </ChartCard>
  );
}
