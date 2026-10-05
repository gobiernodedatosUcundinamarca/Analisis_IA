"use client";

import { GraficaDistribucion } from "@/components/charts/GraficaDistribucion";
import { FilaKpis, KpiCard } from "@/components/ui/KpiCard";
import { PanelLectura } from "@/components/ui/Paneles";
import { media } from "@/lib/encuesta/agregaciones";
import { useDatos, useFilas } from "@/lib/encuesta/EncuestaProvider";
import { kpiProporcion } from "@/lib/encuesta/presentacion";
import { num } from "@/lib/formato";
import { CompetenciasApiladas } from "./CompetenciasApiladas";

export function VistaUso() {
  const datos = useDatos();
  const filas = useFilas();
  const todas = datos?.datos.filas ?? [];

  const chatgpt = kpiProporcion(filas, todas, (f) => (f.herramientas === null ? null : f.herramientas.includes("chatgpt")));
  const redactar = kpiProporcion(filas, todas, (f) => (f.actividades === null ? null : f.actividades.includes("redactar")));
  const tiempo = kpiProporcion(filas, todas, (f) => (f.beneficios === null ? null : f.beneficios.includes("tiempo")));
  const competencias = media(filas.map((f) => f.compMedia));

  return (
    <div className="space-y-8">
      <FilaKpis>
        <KpiCard etiqueta="Usa ChatGPT" pregunta="P5" {...chatgpt} />
        <KpiCard etiqueta="Usa IA para redactar o mejorar documentos" pregunta="P6" {...redactar} />
        <KpiCard
          etiqueta="Promedio de competencias (0 = ninguna, 4 = muy alta)"
          valor={num(competencias, 2)}
          detalle={`Promedio de ${filas.length} respuestas`}
          pregunta="P8–P12"
          comparacion={{ actual: competencias, total: media(todas.map((f) => f.compMedia)) }}
          unidadDelta="puntos"
        />
        <KpiCard etiqueta="Reporta ahorro de tiempo como beneficio" pregunta="P13" {...tiempo} />
      </FilaKpis>

      <div className="grid gap-6 xl:grid-cols-2">
        <GraficaDistribucion
          dim="frecuencia"
          titulo="Frecuencia de uso de IA en actividades laborales (% de respuestas)"
          orden="catalogo"
          tipo="columnas"
          ejeX="Frecuencia de uso, de menor a mayor"
        />
        <GraficaDistribucion
          dim="actividades"
          titulo="Actividades en las que usa IA (% de respuestas, selección múltiple)"
          omitir={["no_usa", "otra"]}
        />
      </div>

      <CompetenciasApiladas />

      <PanelLectura>
        <p>
          La mitad usa IA al menos varias veces por semana y ChatGPT es la herramienta principal (75 %). El uso se concentra en redactar
          documentos; analizar datos y automatizar tareas son menos frecuentes. Las competencias son sobre todo de nivel medio: las más débiles
          son formular instrucciones claras y analizar datos con IA. El beneficio más reportado es el ahorro de tiempo (65 %).
        </p>
      </PanelLectura>
    </div>
  );
}
