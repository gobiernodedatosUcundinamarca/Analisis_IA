/**
 * Colores de las gráficas como referencias a tokens CSS (definidos y validados en `globals.css`).
 * Regla visual: el verde institucional domina; las escalas ordenadas usan una rampa de verdes.
 */

export const SERIE_1 = "var(--chart-serie-1)";

/** Rampa ordinal de 5 pasos (claro = bajo en la escala, oscuro = alto). */
export const ESCALA_5 = ["var(--escala-1)", "var(--escala-2)", "var(--escala-3)", "var(--escala-4)", "var(--escala-5)"];
/** Texto legible sobre cada paso de ESCALA_5 (contraste ≥ 4,5:1 calculado para cada relleno). */
export const TEXTO_ESCALA_5 = ["var(--uc-text)", "var(--uc-text)", "var(--uc-black)", "var(--uc-white)", "var(--uc-white)"];

/** Color fijo de cada nivel de apropiación (rampa ordinal de 4 pasos). */
export const COLOR_NIVEL: Record<string, string> = {
  inicial: "var(--escala-1)",
  basico: "var(--escala-2)",
  intermedio: "var(--escala-4)",
  avanzado: "var(--escala-5)",
};
