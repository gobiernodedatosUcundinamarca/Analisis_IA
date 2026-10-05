/** Formato numérico en español de Colombia (coma decimal, símbolo % separado). */

const formatoPorcentaje = new Map<number, Intl.NumberFormat>();
const formatoNumero = new Map<number, Intl.NumberFormat>();

/**
 * Formatea un porcentaje expresado de 0 a 100.
 * @example pct(96.44) // "96,4 %"
 */
export function pct(valor: number, decimales = 1): string {
  if (!Number.isFinite(valor)) return "—";
  let f = formatoPorcentaje.get(decimales);
  if (!f) {
    f = new Intl.NumberFormat("es-CO", { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: decimales });
    formatoPorcentaje.set(decimales, f);
  }
  return f.format(valor / 100);
}

/** @example num(2.536, 2) // "2,54" */
export function num(valor: number, decimales = 1): string {
  if (!Number.isFinite(valor)) return "—";
  let f = formatoNumero.get(decimales);
  if (!f) {
    f = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: decimales });
    formatoNumero.set(decimales, f);
  }
  return f.format(valor);
}

/** Diferencia en puntos porcentuales con signo explícito. @example pp(4.2) // "+4,2 pp" */
export function pp(valor: number): string {
  const signo = valor > 0 ? "+" : valor < 0 ? "−" : "±";
  return `${signo}${num(Math.abs(valor), 1)} pp`;
}

/**
 * @example fecha("2026-09-28") // "28 de septiembre de 2026"
 * @example fecha("2026-09-28", true) // "28/09/2026"
 */
export function fecha(iso: string, corta = false): string {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  const opciones: Intl.DateTimeFormatOptions = corta
    ? { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }
    : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  return new Intl.DateTimeFormat("es-CO", opciones).format(new Date(Date.UTC(a, m - 1, d)));
}
