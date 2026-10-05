"""Genera la versión anonimizada del Excel de la encuesta, que es la que se publica en el repositorio.

El Excel original exportado de Microsoft Forms no se versiona (ver .gitignore). Este script:

1. Vacía las columnas de identificación: correo electrónico, nombre y hora de la última modificación
   (en el original ya venían como «anonymous» o vacías; se dejan vacías de forma explícita).
2. Agrupa las unidades o dependencias con menos de K_MINIMO respuestas en «Otras unidades», porque la
   combinación unidad + tipo de funciones podría identificar a una persona en una unidad pequeña.
   La unidad se escribe normalizada (minúsculas, sin tildes ni prefijos «Dirección de», «Oficina de»…).
3. Conserva todas las demás respuestas sin cambios y la misma estructura de columnas, para que el
   notebook y el dashboard produzcan los mismos resultados.

Antes de publicar se revisaron las respuestas abiertas: no contienen nombres, correos, teléfonos ni
números de documento.

Uso (desde la carpeta raíz del proyecto):  python anonimizar_encuesta.py
"""

from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import pandas as pd

RAIZ = Path(__file__).resolve().parent
SALIDA = RAIZ / "Encuesta_IA_anonimizada.xlsx"
K_MINIMO = 3
COLUMNA_UNIDAD = 6
COLUMNAS_IDENTIFICACION = [3, 4, 5]  # correo, nombre, hora de la última modificación


def norm_unidad(x) -> str:
    """Misma normalización que usan el notebook y scripts/generar_datos.py del dashboard."""
    t = "".join(c for c in unicodedata.normalize("NFD", str(x)) if unicodedata.category(c) != "Mn").lower().strip()
    t = re.sub(r"\b(direccion|oficina|unidad)( de| del)?\b", "", t).strip()
    return re.sub(r"\s+", " ", t)


def main() -> None:
    originales = [p for p in RAIZ.glob("*.xlsx") if p.name != SALIDA.name and not p.name.startswith("~$")]
    if not originales:
        raise SystemExit("No se encontró el Excel original de la encuesta en la carpeta raíz.")
    origen = sorted(originales)[0]
    df = pd.read_excel(origen)
    columnas = df.columns

    for i in COLUMNAS_IDENTIFICACION:
        df[columnas[i]] = None

    unidad = df[columnas[COLUMNA_UNIDAD]].map(norm_unidad)
    conteo = unidad.value_counts()
    pequenas = conteo[conteo < K_MINIMO].index
    df[columnas[COLUMNA_UNIDAD]] = unidad.where(~unidad.isin(pequenas), "otras unidades")

    df.to_excel(SALIDA, index=False)
    print(f"Origen: {origen.name}")
    print(f"Escrito: {SALIDA.name} ({len(df)} respuestas, {len(columnas)} columnas)")
    print(
        f"Unidades: {conteo.size} distintas; {len(pequenas)} con menos de {K_MINIMO} respuestas "
        f"agrupadas en «otras unidades» ({int(conteo[pequenas].sum())} respuestas)"
    )


if __name__ == "__main__":
    main()
