# Dashboard · Diagnóstico de uso de IA

Tablero web de la **Universidad de Cundinamarca** con los resultados de la *Encuesta diagnóstica sobre uso de Inteligencia Artificial en
procesos administrativos* (226 respuestas). Resume el análisis del notebook `../Analisis_EDA_Uso_IA.ipynb` en 4 apartados: 1. Síntesis del
diagnóstico, 2. Nivel de uso y competencias, 3. Brechas y requerimientos, y 4. Metodología y ficha técnica.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4 con los tokens institucionales
- Gráficas propias en HTML/CSS (sin librería de gráficas) e íconos de `lucide-react`
- Datos: JSON estático generado con Python (`pandas`, `scipy`) a partir del Excel de la encuesta
- Gestor de paquetes: **pnpm** (nunca npm ni yarn)

## Requisitos

- Node.js 20.9 o superior (LTS)
- Corepack habilitado, que provee pnpm 12
- Python 3.11 o superior con `pandas`, `openpyxl`, `numpy` y `scipy` (solo para regenerar los datos)

## Arranque

```bash
corepack enable
pnpm install
pnpm dev          # http://localhost:3000 abre directamente la Síntesis del diagnóstico
```

Si cambia la encuesta, genere primero el Excel anonimizado (`python ../anonimizar_encuesta.py`, que crea
`../Encuesta_IA_anonimizada.xlsx`) y luego regenere los datos:

```bash
pnpm datos        # escribe public/data/encuesta-ia.json
```

## Scripts

| Script | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Compilación de producción |
| `pnpm start` | Sirve la compilación de producción |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Genera los tipos de rutas y revisa TypeScript |
| `pnpm test` | Pruebas de los cálculos (Vitest) |
| `pnpm datos` | Regenera el JSON de datos desde el Excel |

Antes de publicar, todo en verde: `pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm audit`.

## Estructura

```text
dashboard/
├── public/
│   ├── brand/            imagotipo institucional (copiado de ../.claude/lmagenes)
│   └── data/             encuesta-ia.json (generado, anonimizado)
├── scripts/              generar_datos.py
├── src/
│   ├── app/
│   │   ├── page.tsx                  redirige a la primera vista (no hay portada)
│   │   └── temas/[temaId]/           layout del tablero y una carpeta por vista:
│   │       resumen/ uso/ barreras/ metodologia/
│   ├── components/       generales: brand/, layout/, charts/, ui/
│   └── lib/              temas, formato, colores y lógica de la encuesta (lib/encuesta)
└── docs/                 arquitectura, guía de desarrollo, componentes y ADR
```

## Documentación

- Guía maestra: [`../.claude/CLAUDE.md`](../.claude/CLAUDE.md)
- Reglas del proyecto: [`../.claude/reglas/`](../.claude/reglas/)
- [Arquitectura](docs/arquitectura.md) · [Guía de desarrollo](docs/guia-desarrollo.md) · [Componentes](docs/componentes.md) · [Decisiones (ADR)](docs/adr/)
- [Historial de cambios](CHANGELOG.md)
