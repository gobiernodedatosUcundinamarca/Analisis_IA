"use client";

import { FilaKpis, KpiCard } from "@/components/ui/KpiCard";
import { useDatos } from "@/lib/encuesta/EncuestaProvider";
import { fecha, num } from "@/lib/formato";
import { CriteriosCalculo } from "./Criterios";
import { ExplicacionIndice } from "./ExplicacionIndice";
import { TablaPreguntas } from "./TablaPreguntas";

export function VistaMetodologia() {
  const datos = useDatos();
  const meta = datos?.datos.meta;
  const hora = (iso?: string) => (iso ? iso.slice(11, 16) : "");

  return (
    <div className="space-y-8">
      <FilaKpis>
        <KpiCard etiqueta="Encuestas recibidas" valor={meta ? String(meta.respuestas) : "—"} detalle="Sin respuestas duplicadas" />
        <KpiCard
          etiqueta="Fecha de aplicación"
          valor={meta ? fecha(meta.inicio, true) : "—"}
          detalle={meta ? `De ${hora(meta.inicio)} a ${hora(meta.fin)}` : undefined}
        />
        <KpiCard
          etiqueta="Tiempo mediano de diligenciamiento"
          valor={meta ? `${num(meta.duracionMin.mediana, 1)} min` : "—"}
          detalle={meta ? `La mitad tardó entre ${num(meta.duracionMin.p25, 1)} y ${num(meta.duracionMin.p75, 1)} min` : undefined}
        />
        <KpiCard
          etiqueta="Unidades o dependencias (datos anonimizados)"
          valor={datos ? String(datos.datos.estaticos.unidades.distintas) : "—"}
          detalle="Las unidades con menos de 3 respuestas se agrupan en «otras unidades»"
          pregunta="P1"
        />
      </FilaKpis>

      <TablaPreguntas />
      <ExplicacionIndice />
      <CriteriosCalculo />
    </div>
  );
}
