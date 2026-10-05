"use client";

import { DataTable } from "@/components/charts/DataTable";
import { Esqueleto } from "@/components/ui/Estados";
import { useDatos } from "@/lib/encuesta/EncuestaProvider";

/** Apartado del tablero donde se muestra cada pregunta (P1 a P19). */
const DONDE: Record<string, string> = {
  P1: "4. Metodología y ficha técnica",
  P2: "1. Síntesis · filtro general",
  P3: "1. Síntesis",
  P4: "1. Síntesis · 2. Uso y competencias · filtro general · índice",
  P5: "2. Uso y competencias",
  P6: "2. Uso y competencias · índice",
  P7: "No se presenta",
  P8: "2. Uso y competencias · índice",
  P9: "2. Uso y competencias · índice",
  P10: "2. Uso y competencias · índice",
  P11: "2. Uso y competencias · índice",
  P12: "2. Uso y competencias · índice",
  P13: "2. Uso y competencias",
  P14: "No se presenta",
  P15: "3. Brechas y requerimientos",
  P16: "1. Síntesis · 3. Brechas y requerimientos",
  P17: "3. Brechas y requerimientos",
  P18: "3. Brechas y requerimientos",
  P19: "No se presenta",
};

/** Ficha de preguntas aplicadas con el apartado donde aparece cada una. */
export function TablaPreguntas() {
  const datos = useDatos();
  if (!datos) return <Esqueleto />;

  return (
    <section aria-labelledby="titulo-preguntas" className="rounded-2xl border border-uc-border bg-uc-surface p-4 md:p-5">
      <h2 id="titulo-preguntas" className="mb-3 text-lg font-semibold text-uc-text">
        Preguntas aplicadas
      </h2>
      <DataTable
        titulo="Preguntas aplicadas"
        completa
        columnas={["Código", "Pregunta", "Apartado del tablero"]}
        filas={Object.keys(DONDE).map((p) => [p, datos.datos.preguntas[p] ?? "", DONDE[p]])}
      />
      <p className="mt-3 text-xs text-uc-text-secondary">«índice»: la pregunta forma parte del índice de apropiación.</p>
    </section>
  );
}
