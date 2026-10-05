"use client";

import { GraficaDistribucion } from "@/components/charts/GraficaDistribucion";
import { FilaKpis, KpiCard } from "@/components/ui/KpiCard";
import { PanelLectura } from "@/components/ui/Paneles";
import { COLOR_NIVEL } from "@/lib/colores";
import { media } from "@/lib/encuesta/agregaciones";
import { useDatos, useFilas } from "@/lib/encuesta/EncuestaProvider";
import { kpiProporcion } from "@/lib/encuesta/presentacion";
import { num } from "@/lib/formato";

export function VistaResumen() {
  const datos = useDatos();
  const filas = useFilas();
  const todas = datos?.datos.filas ?? [];

  const uso = kpiProporcion(filas, todas, (f) => (f.uso === null ? null : f.uso !== "no"));
  const intensivo = kpiProporcion(filas, todas, (f) => f.frecuencia === "semanal" || f.frecuencia === "diario");
  const orientaciones = kpiProporcion(filas, todas, (f) => (f.claridad === null ? null : f.claridad === "completa"));
  const indice = media(filas.map((f) => f.indice));

  return (
    <div className="space-y-8">
      <FilaKpis>
        <KpiCard etiqueta="Ha usado IA en su trabajo" pregunta="P3" {...uso} />
        <KpiCard etiqueta="Uso intensivo: varias veces por semana o a diario" pregunta="P4" {...intensivo} />
        <KpiCard
          etiqueta="Índice medio de apropiación (0 a 100)"
          valor={num(indice, 1)}
          detalle={`Promedio de ${filas.length} respuestas`}
          pregunta="Índice (ver Metodología y ficha técnica)"
          comparacion={{ actual: indice, total: media(todas.map((f) => f.indice)) }}
          unidadDelta="puntos"
        />
        <KpiCard etiqueta="Conoce completamente las orientaciones de uso responsable" pregunta="P16" {...orientaciones} />
      </FilaKpis>

      <div className="grid gap-6 xl:grid-cols-2">
        <GraficaDistribucion dim="funciones" titulo="Participantes por tipo de funciones (% de respuestas)" orden="catalogo" />
        <GraficaDistribucion
          dim="nivel"
          titulo="Personas por nivel de apropiación de IA (% de respuestas)"
          orden="catalogo"
          tipo="columnas"
          preguntas={["P4", "P6", "P8", "P9", "P10", "P11", "P12"]}
          ejeX="Inicial 0–25 · Básico 25–45 · Intermedio 45–65 · Avanzado más de 65"
          colores={COLOR_NIVEL}
        />
      </div>

      <PanelLectura>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Adopción alta, apropiación incipiente:</strong> el 96 % ha usado IA y la mitad la usa varias veces por semana, pero solo el
            15 % la integra en sus procesos.
          </li>
          <li>
            <strong>Uso centrado en redactar documentos (72 %);</strong> analizar datos (27 %) y automatizar tareas (22 %) son poco frecuentes.
          </li>
          <li>
            <strong>Riesgo y gobernanza:</strong> el 56 % se preocupa por la privacidad y solo el 29 % conoce completamente las orientaciones
            institucionales.
          </li>
          <li>
            <strong>Siguiente paso pedido:</strong> la formación avanzada en automatización y agentes de IA es el apoyo más solicitado (44 %).
          </li>
        </ul>
      </PanelLectura>
    </div>
  );
}
