export interface Tabla {
  columnas: string[];
  filas: (string | number)[][];
}

/** Celda numérica: número, porcentaje, diferencia con signo, valor p o «—». */
const esNumerica = (v: string | number) => typeof v === "number" || /^[-−+<>±]?\s?[\d—]/.test(v);

/**
 * Tabla equivalente a una gráfica: permite leer los valores exactos sin depender del color ni del cursor.
 * Las columnas numéricas se alinean a la derecha con cifras tabulares; las de texto, a la izquierda.
 *
 * Con `completa` la tabla muestra todas sus filas; por defecto se limita a 420 px de alto con desplazamiento interno
 * (vista de tabla de una gráfica).
 *
 * @example
 * <DataTable titulo="Frecuencia de uso" columnas={["Opción", "%", "Personas"]} filas={[["Nunca", "4 %", 9]]} />
 */
export function DataTable({ titulo, columnas, filas, completa = false }: Tabla & { titulo: string; completa?: boolean }) {
  const numericas = columnas.map((_, j) => j > 0 && filas.length > 0 && filas.every((f) => esNumerica(f[j] ?? "")));

  return (
    <div className={completa ? "overflow-x-auto" : "max-h-[420px] overflow-auto"}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{titulo}</caption>
        <thead className="sticky top-0 bg-uc-surface">
          <tr>
            {columnas.map((c, j) => (
              <th
                key={c}
                scope="col"
                className={`border-b border-uc-border px-2 py-1.5 align-bottom text-[13px] font-semibold text-uc-text-secondary ${numericas[j] ? "text-right" : "text-left"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={i} className="border-b border-uc-border align-top last:border-0">
              {fila.map((celda, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-2 py-1.5 text-left font-medium text-uc-text">
                    {celda}
                  </th>
                ) : (
                  <td key={j} className={`px-2 py-1.5 text-uc-text ${numericas[j] ? "cifras-tabulares text-right whitespace-nowrap" : "text-left"}`}>
                    {celda}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
