"use client";

import { GraficaDistribucion } from "@/components/charts/GraficaDistribucion";
import { FilaKpis, KpiCard } from "@/components/ui/KpiCard";
import { PanelLectura } from "@/components/ui/Paneles";
import { useDatos, useFilas } from "@/lib/encuesta/EncuestaProvider";
import { kpiProporcion } from "@/lib/encuesta/presentacion";

export function VistaBarreras() {
  const datos = useDatos();
  const filas = useFilas();
  const todas = datos?.datos.filas ?? [];

  const privacidad = kpiProporcion(filas, todas, (f) => (f.barreras === null ? null : f.barreras.includes("privacidad")));
  const noConoce = kpiProporcion(filas, todas, (f) =>
    f.claridad === null ? null : f.claridad === "no_sabe" || f.claridad === "no_conoce" || f.claridad === "escuchado",
  );
  const automatizacion = kpiProporcion(filas, todas, (f) => (f.oportunidades === null ? null : f.oportunidades.includes("automatizacion")));
  const avanzada = kpiProporcion(filas, todas, (f) => (f.apoyos === null ? null : f.apoyos.includes("avanzada")));

  return (
    <div className="space-y-8">
      <FilaKpis>
        <KpiCard etiqueta="Le preocupa la privacidad o seguridad de la información" pregunta="P15" {...privacidad} />
        <KpiCard etiqueta="No conoce las orientaciones institucionales o solo ha oído de ellas" pregunta="P16" {...noConoce} />
        <KpiCard etiqueta="Ve potencial en automatizar tareas repetitivas" pregunta="P17" {...automatizacion} />
        <KpiCard etiqueta="Prioriza formación avanzada en automatización y agentes" pregunta="P18" {...avanzada} />
      </FilaKpis>

      <div className="grid gap-6 xl:grid-cols-2">
        <GraficaDistribucion
          dim="barreras"
          titulo="¿Qué le dificulta usar más o mejor la IA? (% de respuestas, máximo 3)"
          omitir={["otra"]}
        />
        <GraficaDistribucion
          dim="oportunidades"
          titulo="Actividades donde la IA podría ayudar más (% de respuestas, selección múltiple)"
          omitir={["otra"]}
        />
      </div>

      <GraficaDistribucion
        dim="apoyos"
        titulo="Apoyo prioritario para fortalecer el uso de IA (% de respuestas, máximo 2)"
        omitir={["otra"]}
      />

      <PanelLectura>
        <p>
          Las principales barreras son la privacidad de la información (56 %) y las respuestas incorrectas (41 %), y una de cada cuatro personas
          no conoce las orientaciones institucionales. Donde más se ve potencial es en documentos (56 %), gestión de información (44 %) y análisis
          de datos (42 %). El apoyo más pedido es la formación avanzada en automatización y agentes de IA (44 %), por encima de la formación
          básica (32 %).
        </p>
      </PanelLectura>
    </div>
  );
}
