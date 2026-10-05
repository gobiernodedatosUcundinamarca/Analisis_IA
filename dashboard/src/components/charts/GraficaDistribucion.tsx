"use client";

import type { ReactNode } from "react";
import { distribucion } from "@/lib/encuesta/agregaciones";
import type { IdDimension } from "@/lib/encuesta/dimensiones";
import { useDatos, useFilas, useSeleccion } from "@/lib/encuesta/EncuestaProvider";
import { itemsBarra, ordenarDesc, tablaDistribucion } from "@/lib/encuesta/presentacion";
import { BarList } from "./BarList";
import { ChartCard } from "./ChartCard";
import { ColumnChart } from "./ColumnChart";

interface GraficaDistribucionProps {
  /** Dimensión (pregunta) que se grafica; también es la dimensión que filtra al hacer clic. */
  dim: IdDimension;
  titulo: string;
  descripcion?: string;
  /** `valor`: de mayor a menor (selección múltiple); `catalogo`: orden de la escala (preguntas ordinales). */
  orden?: "valor" | "catalogo";
  tipo?: "barras" | "columnas";
  /** Ids de opciones que no se grafican (siguen contando en la base). */
  omitir?: string[];
  /** Preguntas de origen si difieren de la de la dimensión. */
  preguntas?: string[];
  ejeX?: string;
  /** Color por opción (p. ej. pasos de una escala ordinal en columnas). */
  colores?: Record<string, string>;
  nota?: ReactNode;
  className?: string;
}

/**
 * Distribución de respuestas de una pregunta con filtrado cruzado: la gráfica ignora su propio
 * filtro para seguir mostrando todas las opciones, resalta las seleccionadas y filtra el tablero al hacer clic.
 *
 * @example
 * <GraficaDistribucion dim="frecuencia" titulo="Frecuencia de uso de IA (% de respuestas)" orden="catalogo" tipo="columnas" />
 */
export function GraficaDistribucion({
  dim,
  titulo,
  descripcion,
  orden = "valor",
  tipo = "barras",
  omitir = [],
  preguntas,
  ejeX,
  colores,
  nota,
  className,
}: GraficaDistribucionProps) {
  const datos = useDatos();
  const filas = useFilas(dim);
  const { seleccion, alternar } = useSeleccion(dim);
  const dimension = datos?.dims[dim];
  const d = dimension ? distribucion(filas, dimension, omitir) : null;
  const items = d ? (orden === "valor" ? ordenarDesc(d.items) : d.items) : [];
  const barras = d ? itemsBarra(items, d.n) : [];

  return (
    <ChartCard
      titulo={titulo}
      descripcion={descripcion}
      preguntas={preguntas ?? (dimension ? [dimension.pregunta] : undefined)}
      modo="interactivo"
      n={d?.n}
      vacio={d?.n === 0}
      tabla={d ? tablaDistribucion(d, items) : undefined}
      nota={nota}
      className={className}
    >
      {tipo === "barras" ? (
        <BarList items={barras} seleccion={seleccion} onSeleccionar={alternar} />
      ) : (
        <ColumnChart
          items={barras.map((b) => ({ ...b, color: colores?.[b.id] }))}
          ejeX={ejeX}
          seleccion={seleccion}
          onSeleccionar={alternar}
        />
      )}
    </ChartCard>
  );
}
