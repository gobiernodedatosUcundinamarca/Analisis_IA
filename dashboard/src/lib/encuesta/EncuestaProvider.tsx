"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  crearDimensiones,
  filtrarFilas,
  filtrosAQuery,
  queryAFiltros,
  type Dimensiones,
  type Filtros,
  type IdDimension,
} from "./dimensiones";
import type { DatosEncuesta, Fila } from "./tipos";

/** Por debajo de este número de respuestas los porcentajes se marcan como inestables. */
export const N_MINIMO = 30;

type EstadoCarga =
  | { estado: "cargando" }
  | { estado: "error"; mensaje: string }
  | { estado: "listo"; datos: DatosEncuesta; dims: Dimensiones };

interface ContextoEncuesta {
  carga: EstadoCarga;
  reintentar: () => void;
  filtros: Filtros;
  /** Agrega o quita un valor del filtro de una dimensión (clic en una gráfica o casilla). */
  alternar: (dim: IdDimension, valor: string) => void;
  /** Quita un valor, o toda la dimensión si no se indica valor. */
  quitar: (dim: IdDimension, valor?: string) => void;
  limpiar: () => void;
  /** Filtros activos como query string (`?funciones=…`) para conservarlos al navegar. */
  query: string;
  totalActivos: number;
}

const Contexto = createContext<ContextoEncuesta | null>(null);

/**
 * Carga los datos de la encuesta una sola vez y mantiene los filtros globales del tema.
 * Vive en el layout del tema, por lo que datos y filtros se conservan al cambiar de vista,
 * y los filtros se reflejan en la URL para poder compartir una vista filtrada.
 *
 * @example
 * <EncuestaProvider fuente="/data/encuesta-ia.json">{children}</EncuestaProvider>
 */
export function EncuestaProvider({ fuente, children }: { fuente: string; children: ReactNode }) {
  const [carga, setCarga] = useState<EstadoCarga>({ estado: "cargando" });
  const [intento, setIntento] = useState(0);
  const [filtros, setFiltros] = useState<Filtros>({});

  useEffect(() => {
    let vigente = true;
    fetch(fuente)
      .then((r) => {
        if (!r.ok) throw new Error(`El servidor respondió ${r.status}`);
        return r.json() as Promise<DatosEncuesta>;
      })
      .then((datos) => {
        if (!vigente) return;
        const dims = crearDimensiones(datos);
        setFiltros(queryAFiltros(window.location.search, dims));
        setCarga({ estado: "listo", datos, dims });
      })
      .catch((e: unknown) => {
        if (vigente) setCarga({ estado: "error", mensaje: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      vigente = false;
    };
  }, [fuente, intento]);

  const reintentar = useCallback(() => {
    setCarga({ estado: "cargando" });
    setIntento((i) => i + 1);
  }, []);

  const aplicar = useCallback((nuevos: Filtros) => {
    setFiltros(nuevos);
    window.history.replaceState(null, "", window.location.pathname + filtrosAQuery(nuevos));
  }, []);

  const alternar = useCallback(
    (dim: IdDimension, valor: string) => {
      const actual = filtros[dim] ?? [];
      const siguiente = actual.includes(valor) ? actual.filter((v) => v !== valor) : [...actual, valor];
      const nuevos: Filtros = { ...filtros };
      if (siguiente.length > 0) nuevos[dim] = siguiente;
      else delete nuevos[dim];
      aplicar(nuevos);
    },
    [filtros, aplicar],
  );

  const quitar = useCallback(
    (dim: IdDimension, valor?: string) => {
      const nuevos: Filtros = { ...filtros };
      const restantes = valor ? (filtros[dim] ?? []).filter((v) => v !== valor) : [];
      if (restantes.length > 0) nuevos[dim] = restantes;
      else delete nuevos[dim];
      aplicar(nuevos);
    },
    [filtros, aplicar],
  );

  const limpiar = useCallback(() => aplicar({}), [aplicar]);

  const valor = useMemo<ContextoEncuesta>(
    () => ({
      carga,
      reintentar,
      filtros,
      alternar,
      quitar,
      limpiar,
      query: filtrosAQuery(filtros),
      totalActivos: Object.values(filtros).reduce((s, v) => s + (v?.length ? 1 : 0), 0),
    }),
    [carga, reintentar, filtros, alternar, quitar, limpiar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/** Acceso al estado de carga, los filtros y sus acciones. */
export function useEncuesta(): ContextoEncuesta {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useEncuesta debe usarse dentro de <EncuestaProvider>");
  return ctx;
}

/** Datos y dimensiones cuando ya cargaron; `null` mientras carga o si hubo error. */
export function useDatos(): { datos: DatosEncuesta; dims: Dimensiones } | null {
  const { carga } = useEncuesta();
  return carga.estado === "listo" ? { datos: carga.datos, dims: carga.dims } : null;
}

/**
 * Respuestas que cumplen los filtros activos.
 * @param excluir dimensión cuyo propio filtro se ignora: así la gráfica de esa dimensión sigue
 * mostrando todas sus categorías y resalta la selección (filtrado cruzado).
 */
export function useFilas(excluir?: IdDimension): Fila[] {
  const { carga, filtros } = useEncuesta();
  return useMemo(() => {
    if (carga.estado !== "listo") return [];
    return filtrarFilas(carga.datos.filas, filtros, carga.dims, excluir);
  }, [carga, filtros, excluir]);
}

/** Valores seleccionados en una dimensión y la acción para alternarlos (para gráficas que filtran). */
export function useSeleccion(dim: IdDimension): { seleccion: string[]; alternar: (valor: string) => void } {
  const { filtros, alternar } = useEncuesta();
  const seleccion = filtros[dim] ?? [];
  return { seleccion, alternar: (valor: string) => alternar(dim, valor) };
}
