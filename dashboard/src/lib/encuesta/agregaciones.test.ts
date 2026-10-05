import { describe, expect, it } from "vitest";
import datosJson from "../../../public/data/encuesta-ia.json";
import { distribucion, media, proporcion } from "./agregaciones";
import { crearDimensiones, filtrarFilas, filtrosAQuery, queryAFiltros } from "./dimensiones";
import type { DatosEncuesta } from "./tipos";

const datos = datosJson as unknown as DatosEncuesta;
const dims = crearDimensiones(datos);
const filas = datos.filas;

describe("datos de la encuesta", () => {
  it("tiene las 226 respuestas", () => {
    expect(filas).toHaveLength(226);
    expect(datos.meta.respuestas).toBe(226);
  });

  it("el índice de cada respuesta coincide con la fórmula 40/40/20 de Metodología", () => {
    for (const f of filas) {
      const indice = (0.4 * (f.frecuenciaN / 4) + 0.4 * (f.compMedia / 4) + 0.2 * (Math.min(f.nActividades, 6) / 6)) * 100;
      expect(indice).toBeCloseTo(f.indice, 2);
    }
    expect(media(filas.map((f) => f.indice))).toBeCloseTo(54.1, 1);
  });
});

describe("distribucion y proporcion", () => {
  it("usa como base a quienes respondieron la pregunta", () => {
    const uso = distribucion(filas, dims.uso);
    expect(uso.n).toBe(225); // una persona no respondió P3
    expect(uso.items.reduce((s, i) => s + i.conteo, 0)).toBe(225);
  });

  it("reproduce los KPI del notebook", () => {
    const haUsado = proporcion(filas, (f) => (f.uso === null ? null : f.uso !== "no"));
    expect(haUsado.conteo).toBe(217);
    expect(haUsado.pct).toBeCloseTo(96.44, 1);
    const intensivo = proporcion(filas, (f) => f.frecuencia === "semanal" || f.frecuencia === "diario");
    expect(intensivo.pct).toBeCloseTo(50, 5);
    const conoce = proporcion(filas, (f) => (f.claridad === null ? null : f.claridad === "completa"));
    expect(conoce.pct).toBeCloseTo(28.89, 1);
  });

  it("en selección múltiple los porcentajes pueden sumar más de 100 y respeta omitir", () => {
    const herramientas = distribucion(filas, dims.herramientas);
    expect(herramientas.items.reduce((s, i) => s + i.pct, 0)).toBeGreaterThan(100);
    expect(herramientas.items.find((i) => i.id === "chatgpt")?.conteo).toBe(170);
    expect(distribucion(filas, dims.herramientas, ["otra"]).items.some((i) => i.id === "otra")).toBe(false);
  });
});

describe("filtros", () => {
  it("combina con O dentro de una dimensión y con Y entre dimensiones", () => {
    const directivas = filtrarFilas(filas, { funciones: ["directivas"] }, dims);
    expect(directivas).toHaveLength(23);
    const dos = filtrarFilas(filas, { funciones: ["directivas", "asistenciales"] }, dims);
    expect(dos).toHaveLength(23 + 44);
    const yNivel = filtrarFilas(filas, { funciones: ["directivas"], nivel: ["avanzado"] }, dims);
    expect(yNivel).toHaveLength(filas.filter((f) => f.funciones === "directivas" && f.nivel === "avanzado").length);
    expect(yNivel.length).toBeLessThan(directivas.length);
  });

  it("puede excluir el filtro de una dimensión (filtrado cruzado)", () => {
    expect(filtrarFilas(filas, { funciones: ["directivas"] }, dims, "funciones")).toHaveLength(226);
  });

  it("lee la URL descartando dimensiones y opciones inexistentes", () => {
    const filtros = queryAFiltros("?funciones=directivas,inexistente&foo=bar&nivel=", dims);
    expect(filtros).toEqual({ funciones: ["directivas"] });
    expect(queryAFiltros(filtrosAQuery(filtros), dims)).toEqual(filtros);
  });
});
