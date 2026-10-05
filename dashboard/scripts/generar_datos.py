"""Genera `public/data/encuesta-ia.json` a partir del Excel de la encuesta.

Replica las transformaciones del notebook `Analisis_EDA_Uso_IA.ipynb` (limpieza,
escalas ordinales, índice de apropiación y clasificación de la pregunta abierta)
y exporta los datos por respuesta, ya anonimizados y codificados, para que el
dashboard calcule los agregados en el navegador y pueda filtrarlos.

Por privacidad, el JSON por respuesta NO incluye la unidad (texto libre que podría
identificar a personas de unidades pequeñas) ni el texto de la pregunta abierta.
La unidad se publica solo como conteo agregado, y la pregunta abierta como temas,
palabras frecuentes y 12 ejemplos sin vínculo con la respuesta de la que provienen.

Uso (desde la carpeta `dashboard/`):  pnpm datos
"""

from __future__ import annotations

import datetime as dt
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

DASHBOARD = Path(__file__).resolve().parents[1]
RAIZ = DASHBOARD.parent
SALIDA = DASHBOARD / "public" / "data" / "encuesta-ia.json"

# ---------------------------------------------------------------- catálogos
# Cada opción: (id estable para filtros y URL, texto original de la encuesta, etiqueta corta)

FUNCIONES = [
    ("profesionales", "Profesionales", "Profesionales"),
    ("tecnicas", "Técnicas", "Técnicas"),
    ("asistenciales", "Asistenciales/operativas", "Asistenciales/operativas"),
    ("directivas", "Directivas o de liderazgo", "Directivas o de liderazgo"),
    ("atencion", "Atención al usuario", "Atención al usuario"),
    ("servicios", "Servicios generales", "Servicios generales"),
    ("otras", "Otras (pasante, coordinación)", "Otras"),
]
USO = [
    ("no", "No las he utilizado", "No las ha utilizado"),
    ("probado", "Las he probado, pero casi no las uso", "Las probó, casi no las usa"),
    ("ocasional", "Sí, ocasionalmente", "Sí, ocasionalmente"),
    ("frecuente", "Sí, frecuentemente", "Sí, frecuentemente"),
]
FRECUENCIA = [
    ("nunca", "Nunca", "Nunca"),
    ("esporadico", "Esporádicamente", "Esporádicamente"),
    ("mensual", "Varias veces al mes", "Varias veces al mes"),
    ("semanal", "Varias veces por semana", "Varias veces por semana"),
    ("diario", "Todos o casi todos los días", "Todos o casi todos los días"),
]
MADUREZ = [
    ("no_usa", "No utilizo IA", "No usa IA"),
    ("simple", "Hago preguntas sencillas y utilizo principalmente las respuestas obtenidas", "Preguntas sencillas"),
    ("verifica", "Comparo, verifico y ajusto las respuestas antes de utilizarlas", "Verifica y ajusta"),
    ("instruye", "Sé dar instrucciones detalladas para obtener mejores resultados", "Instrucciones detalladas"),
    ("integra", "Integro la IA en varias etapas de mi trabajo para mejorar procesos o resultados", "Integra en procesos"),
    ("crea", "He creado o configurado automatizaciones, asistentes o soluciones apoyadas en IA", "Crea automatizaciones"),
]
NIVEL_COMPETENCIA = [
    ("ninguna", "Ninguna", "Ninguna"),
    ("baja", "Baja", "Baja"),
    ("media", "Media", "Media"),
    ("alta", "Alta", "Alta"),
    ("muy_alta", "Muy Alta", "Muy alta"),
]
CAMBIO = [
    ("no_usa", "No utilizo IA", "No usa IA"),
    ("nada", "Nada", "Nada"),
    ("muy_poco", "Muy poco", "Muy poco"),
    ("algo", "Algo", "Algo"),
    ("bastante", "Bastante", "Bastante"),
    ("mucho", "Mucho", "Mucho"),
]
CLARIDAD = [
    ("no_sabe", "No sé si existen", "No sabe si existen"),
    ("no_conoce", "No las conozco", "No las conoce"),
    ("escuchado", "He escuchado sobre ellas, pero no las conozco", "Ha oído de ellas"),
    ("parcial", "Parcialmente", "Parcialmente"),
    ("completa", "Sí, completamente", "Sí, completamente"),
]
NIVEL_APROPIACION = [
    ("inicial", "Inicial", "Inicial"),
    ("basico", "Básico", "Básico"),
    ("intermedio", "Intermedio", "Intermedio"),
    ("avanzado", "Avanzado", "Avanzado"),
]

OTRA = ("otra", "Otra respuesta (texto libre)", "Otra respuesta")
HERRAMIENTAS = [
    ("chatgpt", "ChatGPT", "ChatGPT"),
    ("copilot", "Microsoft Copilot", "Microsoft Copilot"),
    ("gemini", "Gemini", "Gemini"),
    ("claude", "Claude", "Claude"),
    ("perplexity", "Perplexity", "Perplexity"),
    ("integradas", "Herramientas de IA incorporadas en otros programas o plataformas", "IA integrada en otras plataformas"),
    ("ninguna", "Ninguna", "Ninguna"),
    OTRA,
]
ACTIVIDADES = [
    ("redactar", "Redactar o mejorar documentos, comunicaciones o informes", "Redactar o mejorar documentos"),
    ("buscar", "Buscar, organizar o analizar información", "Buscar y organizar información"),
    ("resumir", "Resumir documentos o información", "Resumir documentos"),
    ("analizar", "Analizar datos o apoyar la elaboración de reportes", "Analizar datos y reportes"),
    ("ideas", "Generar ideas o propuestas", "Generar ideas o propuestas"),
    ("automatizar", "Automatizar tareas repetitivas", "Automatizar tareas repetitivas"),
    ("tecnico", "Elaborar fórmulas, consultas, código u otros apoyos técnicos", "Fórmulas, consultas o código"),
    ("usuarios", "Apoyar la atención o respuesta a usuarios", "Atención a usuarios"),
    ("presentaciones", "Preparar presentaciones", "Preparar presentaciones"),
    ("reuniones", "Preparar reuniones, agendas o actas", "Reuniones, agendas o actas"),
    ("no_usa", "No utilizo IA en mi trabajo", "No usa IA en su trabajo"),
    OTRA,
]
BENEFICIOS = [
    ("tiempo", "Ahorro de tiempo", "Ahorro de tiempo"),
    ("calidad", "Mejor calidad de documentos o productos", "Mejor calidad de documentos"),
    ("ideas", "Generación de nuevas ideas o alternativas", "Nuevas ideas o alternativas"),
    ("analisis", "Mayor facilidad para analizar información", "Facilidad para analizar información"),
    ("productividad", "Mayor productividad", "Mayor productividad"),
    ("repetitivas", "Reducción de tareas repetitiva", "Menos tareas repetitivas"),
    ("decisiones", "Mejores decisiones", "Mejores decisiones"),
    ("no_usa", "No utilizo IA", "No usa IA"),
    ("sin_beneficios", "No he identificado beneficios", "No identifica beneficios"),
    OTRA,
]
BARRERAS = [
    ("privacidad", "Me preocupa la privacidad o seguridad de la información", "Privacidad o seguridad de la información"),
    ("incorrectas", "Me preocupa que las respuestas sean incorrectas", "Respuestas incorrectas"),
    ("tiempo", "Falta de tiempo para aprender", "Falta de tiempo para aprender"),
    ("no_sabe_usar", "No sé suficientemente cómo utilizarla", "No sabe cómo utilizarla"),
    ("no_sabe_herramientas", "No sé qué herramientas son adecuadas", "No sabe qué herramientas son adecuadas"),
    ("sin_acceso", "No tengo acceso a herramientas institucionales", "Sin acceso a herramientas institucionales"),
    ("que_info", "No tengo claro qué información puedo ingresar en estas herramientas", "No sabe qué información puede ingresar"),
    ("no_necesaria", "No considero necesario utilizarla", "No la considera necesaria"),
    ("sin_aplicacion", "No identifico aplicaciones útiles para mis funciones", "No ve aplicaciones útiles"),
    OTRA,
]
OPORTUNIDADES = [
    ("documentos", "Elaboración y revisión de documentos", "Elaboración y revisión de documentos"),
    ("gestion_info", "Gestión y análisis de información", "Gestión y análisis de información"),
    ("datos", "Análisis de datos e indicadores", "Análisis de datos e indicadores"),
    ("automatizacion", "Automatización de tareas repetitivas", "Automatización de tareas repetitivas"),
    ("informes", "Elaboración de informes", "Elaboración de informes"),
    ("planeacion", "Planeación y seguimiento de actividades", "Planeación y seguimiento"),
    ("usuarios", "Atención y respuesta a usuarios", "Atención a usuarios"),
    ("decisiones", "Apoyo a la toma de decisiones", "Apoyo a la toma de decisiones"),
    ("reuniones", "Gestión de reuniones, actas y compromisos", "Reuniones, actas y compromisos"),
    OTRA,
]
APOYOS = [
    ("basica", "Formación básica sobre IA", "Formación básica"),
    ("practica", "Formación práctica aplicada a mis funciones", "Formación práctica aplicada"),
    ("avanzada", "Formación avanzada en automatización y agentes de IA", "Formación avanzada (automatización y agentes)"),
    ("guias", "Guías sobre seguridad, privacidad y uso responsable", "Guías de seguridad y uso responsable"),
    ("acceso", "Acceso institucional a herramientas de IA", "Acceso institucional a herramientas"),
    ("acompanamiento", "Acompañamiento para identificar procesos que puedan mejorarse con IA", "Acompañamiento para identificar procesos"),
    ("casos", "Casos de uso y buenas prácticas de otras dependencias", "Casos de uso de otras dependencias"),
    OTRA,
]
# Clasificación de la pregunta abierta por palabras clave (misma del notebook).
TEMAS = [
    ("correos", "Redacción de correos y respuestas", r"correo|respuesta|oficio|carta|comunicaci"),
    ("actas_informes", "Actas, informes y reportes", r"acta|informe|reporte|document|redacci|formato"),
    ("datos", "Datos, bases e indicadores", r"dato|base|indicador|excel|conciliaci|estad|analisis|análisis|presupuesto|contab|factur"),
    ("seguimiento", "Revisión y seguimiento de procesos", r"revisi|seguimiento|verific|control|plan|contrat|archivo|radicad"),
    ("automatizacion", "Automatización / código", r"automat|código|codigo|software|program|script|repetitiv"),
    ("usuarios", "Atención a usuarios / PQRS", r"atenci|usuario|pqrs|estudiante|solicitud|cita"),
    ("contenidos", "Presentaciones, imágenes y contenidos", r"presentaci|imagen|dise|grafic|gráfic|contenido|recurso|video"),
]
COMPETENCIAS = [
    ("instruccion", "Formular instrucciones claras a una herramienta de IA", "Formular instrucciones claras", "P8"),
    ("evaluar", "Evaluar si una respuesta de IA es correcta o confiable", "Evaluar si la respuesta es confiable", "P9"),
    ("analizar", "Utilizar IA para analizar información o datos", "Analizar información o datos con IA", "P10"),
    ("limites", "Identificar cuándo no es apropiado utilizar IA", "Identificar cuándo NO usar IA", "P11"),
    ("proteger", "Proteger información institucional, personal o confidencial al usar IA", "Proteger información confidencial", "P12"),
]


def sin_tildes(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def catalogo(opciones) -> list[dict]:
    return [{"id": i, "texto": t, "etiqueta": e} for i, t, e in opciones]


def mapa_texto(opciones) -> dict[str, str]:
    return {t: i for i, t, _ in opciones}


def split_multi(s) -> list[str]:
    return [o.strip() for o in str(s).split(";") if o.strip()] if pd.notna(s) else []


def codificar_multi(valor, opciones) -> list[str] | None:
    """Convierte la respuesta de selección múltiple en ids; lo escrito a mano va a 'otra'."""
    if pd.isna(valor):
        return None
    mapa = mapa_texto(opciones)
    ids: list[str] = []
    for o in split_multi(valor):
        i = mapa.get(o, "otra")
        if i not in ids:
            ids.append(i)
    return ids


def codificar_simple(valor, opciones) -> str | None:
    if pd.isna(valor):
        return None
    texto = str(valor).strip()
    mapa = mapa_texto(opciones)
    if texto not in mapa:
        raise ValueError(f"Categoría no reconocida: {texto!r}")
    return mapa[texto]


def norm_funciones(x) -> str:
    t = sin_tildes(str(x)).lower().strip()
    if "servi" in t and "general" in t:
        return "servicios"
    return {
        "profesionales": "profesionales",
        "tecnicas": "tecnicas",
        "asistenciales/operativas": "asistenciales",
        "directivas o de liderazgo": "directivas",
        "atencion al usuario": "atencion",
    }.get(t, "otras")


def norm_unidad(x) -> str:
    t = sin_tildes(str(x)).lower().strip()
    t = re.sub(r"\b(direccion|oficina|unidad)( de| del)?\b", "", t).strip()
    return re.sub(r"\s+", " ", t)


def r(x, d=2):
    return None if x is None or (isinstance(x, float) and np.isnan(x)) else round(float(x), d)


def main() -> None:
    # Se usa la versión anonimizada (la que está en el repositorio); el original solo existe en local.
    anonimizado = RAIZ / "Encuesta_IA_anonimizada.xlsx"
    archivo = anonimizado if anonimizado.exists() else sorted(p for p in RAIZ.glob("*.xlsx") if not p.name.startswith("~$"))[0]
    raw = pd.read_excel(archivo)
    c = raw.columns
    preguntas = {
        "P1": str(c[6]).strip().rstrip(":"),
        "P2": str(c[7]).strip().rstrip(":"),
        "P3": str(c[8]).strip(),
        "P4": str(c[9]).strip(),
        "P5": str(c[10]).strip(),
        "P6": str(c[11]).strip(),
        "P7": str(c[12]).strip(),
        **{p: f"Nivel autopercibido: {texto}" for _, texto, _, p in COMPETENCIAS},
        "P13": str(c[18]).strip(),
        "P14": str(c[19]).strip(),
        "P15": str(c[20]).strip(),
        "P16": str(c[21]).strip(),
        "P17": str(c[22]).strip(),
        "P18": str(c[23]).strip(),
        "P19": str(c[24]).strip(),
    }

    # Pregunta abierta: respuestas útiles (misma regla del notebook)
    txt = raw[c[24]].astype("string").str.strip()
    vacio = txt.str.lower().str.replace(r"[^a-záéíóúñ]", "", regex=True).isin(
        ["", "ninguna", "ninguno", "na", "no", "nada", "noaplica", "nose"]
    )
    util = txt.notna() & ~vacio.fillna(True) & (txt.str.len() > 4).fillna(False)

    filas = []
    indices_sin_redondear = []
    idx_freq = {i: n for n, (i, _, _) in enumerate(FRECUENCIA)}
    idx_comp = {t: n for n, (_, t, _) in enumerate(NIVEL_COMPETENCIA)}
    # Actividades que cuentan para la amplitud del índice: las marcadas por ≥30 personas (como en el notebook)
    conteo_act = Counter(o for s in raw[c[11]] for o in split_multi(s))
    act_indice = {mapa_texto(ACTIVIDADES)[t] for t, n in conteo_act.items() if n >= 30 and t in mapa_texto(ACTIVIDADES)}
    act_indice.discard("no_usa")

    for k, fila in raw.iterrows():
        comp = {}
        for j, (cid, _, _, _) in enumerate(COMPETENCIAS):
            v = fila[c[13 + j]]
            comp[cid] = None if pd.isna(v) else idx_comp[str(v).strip()]
        frecuencia = codificar_simple(fila[c[9]], FRECUENCIA)
        actividades = codificar_multi(fila[c[11]], ACTIVIDADES)
        valores_comp = [v for v in comp.values() if v is not None]
        comp_media = float(np.mean(valores_comp)) if valores_comp else np.nan
        n_act = len([a for a in (actividades or []) if a in act_indice])
        freq_n = idx_freq[frecuencia]
        indice = (0.4 * freq_n / 4 + 0.4 * comp_media / 4 + 0.2 * min(n_act, 6) / 6) * 100
        nivel = "inicial" if indice <= 25 else "basico" if indice <= 45 else "intermedio" if indice <= 65 else "avanzado"
        indices_sin_redondear.append(indice)
        texto = str(txt.iloc[k]).lower() if bool(util.iloc[k]) else ""
        temas = [tid for tid, _, rx in TEMAS if texto and re.search(rx, texto)]
        filas.append({
            "id": int(fila["ID"]),
            "funciones": norm_funciones(fila[c[7]]),
            "uso": codificar_simple(fila[c[8]], USO),
            "frecuencia": frecuencia,
            "madurez": codificar_simple(fila[c[12]], MADUREZ),
            "comp": comp,
            "cambio": codificar_simple(fila[c[19]], CAMBIO),
            "claridad": codificar_simple(fila[c[21]], CLARIDAD),
            "herramientas": codificar_multi(fila[c[10]], HERRAMIENTAS),
            "actividades": actividades,
            "beneficios": codificar_multi(fila[c[18]], BENEFICIOS),
            "barreras": codificar_multi(fila[c[20]], BARRERAS),
            "oportunidades": codificar_multi(fila[c[22]], OPORTUNIDADES),
            "apoyos": codificar_multi(fila[c[23]], APOYOS),
            "tareaUtil": bool(util.iloc[k]),
            "temas": temas,
            "frecuenciaN": freq_n,
            "compMedia": r(comp_media, 4),
            "nActividades": n_act,
            "indice": r(indice, 4),
            "nivel": nivel,
        })

    df = pd.DataFrame(filas)
    # Las pruebas usan el índice redondeado a 6 decimales: sin redondear, el ruido de punto
    # flotante rompe empates reales (99 valores distintos en vez de 84) y altera Kruskal-Wallis.
    df["indice"] = np.round(indices_sin_redondear, 6)

    # ------------------------------------------------ agregados estáticos (muestra completa)
    unidades = raw[c[6]].map(norm_unidad).value_counts()
    validas = txt[util]
    ejemplos = validas.sample(12, random_state=3).tolist()
    stop = set(
        "de la el en y a los las del que un una para con por se al es su lo como mas más o me mi le muy son "
        "tareas tarea proceso procesos realizar realizacion elaboracion cada sus este esta entre sin sobre".split()
    )
    palabras = Counter(
        w for t in validas.str.lower() for w in re.findall(r"[a-záéíóúñ]{4,}", t) if w not in stop
    ).most_common(15)

    grupos = ["profesionales", "tecnicas", "asistenciales", "directivas"]
    sub = df[df["funciones"].isin(grupos)]
    kw = stats.kruskal(*[sub.loc[sub["funciones"] == g, "indice"] for g in grupos])
    tabla = pd.crosstab(sub["funciones"], sub["nivel"])
    chi2, p_chi, gl, _ = stats.chi2_contingency(tabla)
    orden_claridad = {i: n for n, (i, _, _) in enumerate(CLARIDAD)}
    d = df.dropna(subset=["claridad"])
    rho_cl, p_cl = stats.spearmanr(d["indice"], d["claridad"].map(orden_claridad))
    spearman_comp = []
    for cid, _, etiqueta, p in COMPETENCIAS:
        serie = df["comp"].map(lambda x: x[cid]).astype(float)
        m = serie.notna()
        rho, pv = stats.spearmanr(serie[m], df.loc[m, "frecuenciaN"])
        spearman_comp.append({"competencia": cid, "rho": r(rho, 3), "p": float(f"{pv:.3g}")})

    inicio = pd.to_datetime(raw["Hora de inicio"])
    fin = pd.to_datetime(raw["Hora de finalización"])
    duracion = (fin - inicio).dt.total_seconds() / 60
    nulos = []
    for p, col in [("P3", 8), ("P7", 12), ("P12", 17), ("P15", 20), ("P16", 21), ("P17", 22), ("P19", 24)]:
        n = int(raw[c[col]].isna().sum())
        if n:
            nulos.append({"pregunta": p, "nulos": n})

    datos = {
        "meta": {
            "titulo": "Encuesta diagnóstica sobre uso de Inteligencia Artificial en procesos administrativos",
            "archivo": archivo.name,
            "respuestas": int(len(df)),
            "inicio": inicio.min().isoformat(),
            "fin": fin.max().isoformat(),
            "generado": dt.datetime.now().isoformat(timespec="seconds"),
            "duracionMin": {
                "mediana": r(duracion.median(), 1),
                "p25": r(duracion.quantile(0.25), 1),
                "p75": r(duracion.quantile(0.75), 1),
                "max": r(duracion.max(), 1),
            },
            "nulos": nulos,
            "columnasDescartadas": ["Correo electrónico (todas 'anonymous')", "Nombre (vacía)", "Hora de la última modificación (vacía)"],
        },
        "preguntas": preguntas,
        "catalogos": {
            "funciones": catalogo(FUNCIONES),
            "uso": catalogo(USO),
            "frecuencia": catalogo(FRECUENCIA),
            "madurez": catalogo(MADUREZ),
            "nivelCompetencia": catalogo(NIVEL_COMPETENCIA),
            "cambio": catalogo(CAMBIO),
            "claridad": catalogo(CLARIDAD),
            "nivel": catalogo(NIVEL_APROPIACION),
            "herramientas": catalogo(HERRAMIENTAS),
            "actividades": catalogo(ACTIVIDADES),
            "beneficios": catalogo(BENEFICIOS),
            "barreras": catalogo(BARRERAS),
            "oportunidades": catalogo(OPORTUNIDADES),
            "apoyos": catalogo(APOYOS),
            "temas": [{"id": i, "texto": t, "etiqueta": t} for i, t, _ in TEMAS],
            "competencias": [{"id": i, "texto": t, "etiqueta": e, "pregunta": p} for i, t, e, p in COMPETENCIAS],
            "actividadesIndice": sorted(act_indice),
        },
        "filas": filas,
        "estaticos": {
            "unidades": {
                "distintas": int(unidades.size),
                "top": [{"unidad": u, "n": int(n)} for u, n in unidades.head(12).items()],
            },
            "tareas": {
                "respuestas": int(txt.notna().sum()),
                "utiles": int(util.sum()),
                "ejemplos": ejemplos,
                "palabras": [{"palabra": w, "n": n} for w, n in palabras],
            },
            "pruebas": {
                "kruskalFunciones": {"H": r(kw.statistic, 2), "p": float(f"{kw.pvalue:.3g}"), "grupos": grupos},
                "chi2NivelFunciones": {"chi2": r(chi2, 1), "gl": int(gl), "p": float(f"{p_chi:.3g}")},
                "spearmanIndiceClaridad": {"rho": r(rho_cl, 3), "p": float(f"{p_cl:.3g}"), "n": int(len(d))},
                "spearmanCompetenciasFrecuencia": spearman_comp,
            },
        },
    }
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(json.dumps(datos, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"OK {SALIDA.relative_to(DASHBOARD)}: {len(filas)} respuestas, {SALIDA.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
