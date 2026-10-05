# Diagnóstico de uso de inteligencia artificial · Universidad de Cundinamarca

Análisis de la *Encuesta diagnóstica sobre uso de Inteligencia Artificial en procesos administrativos* (226 respuestas, septiembre de 2026).

**Objetivo:** identificar el nivel actual de conocimiento, uso y apropiación de herramientas de IA por parte del personal administrativo, así
como las principales oportunidades, necesidades y riesgos para fortalecer su incorporación en los procesos institucionales.

## Contenido

| Ruta | Qué es |
|---|---|
| `Encuesta_IA_anonimizada.xlsx` | Respuestas de la encuesta anonimizadas (sin correos ni nombres; unidades con menos de 3 respuestas agrupadas). |
| `anonimizar_encuesta.py` | Script que genera el Excel anonimizado a partir del original, que no se publica. |
| `Analisis_EDA_Uso_IA.ipynb` | Análisis exploratorio en Python (pandas, seaborn, scipy) con gráficas y explicación por pregunta. |
| `Analisis_EDA_Uso_IA.html` | El mismo análisis exportado a HTML, para leer sin Python. |
| `dashboard/` | Tablero web en Next.js con KPIs, gráficas filtrables y conclusiones. Ver [su README](dashboard/README.md). |
| `.claude/` | Guía maestra del proyecto ([`CLAUDE.md`](.claude/CLAUDE.md)), reglas de diseño y documentación, e identidad visual. |

## Uso rápido

```bash
# Análisis (requiere Python con pandas, openpyxl, matplotlib, seaborn, scipy y jupyter)
jupyter notebook Analisis_EDA_Uso_IA.ipynb

# Dashboard (requiere Node.js 20.9+ y pnpm vía Corepack)
cd dashboard
corepack enable
pnpm install
pnpm dev          # http://localhost:3000
```

## Privacidad

El Excel original exportado de Microsoft Forms no se versiona (ver `.gitignore`). La versión publicada conserva todas las respuestas
cerradas y abiertas, sin datos de identificación. Las respuestas abiertas se revisaron antes de publicar: no contienen nombres, correos,
teléfonos ni números de documento.
