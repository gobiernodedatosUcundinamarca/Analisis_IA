# Regla de control de versiones

## 1. Propósito

Definir cómo se maneja el historial de git y la publicación en el repositorio remoto.

Principio base:

> **Nada sale del equipo sin que la persona responsable lo autorice.** Publicar es un acto
> difícilmente reversible: una vez en el remoto, el contenido queda en el historial, en los clones
> de terceros y en los despliegues automáticos.

---

## 2. Confirmación obligatoria (regla dura)

**Siempre se pide confirmación antes de ejecutar cualquier comando que modifique el historial o el
repositorio remoto.** No se asume autorización por el contexto de la conversación, ni porque una
operación parecida se haya aprobado antes.

Aplica a `git push`, `git commit`, `git remote`, `git merge`, `git rebase`, `git reset`,
`git revert`, `git cherry-pick`, `git tag`, `git rm`, `git clean`, `git restore`, `git checkout`,
`git switch`, `git stash`, `git filter-branch`, y a los comandos de `gh` que crean o modifican
recursos (`gh pr`, `gh repo`, `gh release`).

Está mecanizado en [`.claude/settings.json`](../settings.json) mediante `permissions.ask`, de modo
que la confirmación se solicita aunque se olvide esta regla.

**No requieren confirmación** las operaciones de solo lectura: `git status`, `git log`, `git diff`,
`git show`, `git branch -vv`, `git remote -v`, `git fetch`.

### Prohibiciones

- **No** ejecutar `git push --force` ni `--force-with-lease` sobre `main` sin autorización explícita
  para esa operación concreta.
- **No** reescribir historial ya publicado.
- **No** ejecutar `git commit` ni `git push` como efecto secundario de otra tarea: publicar es
  siempre un paso deliberado y anunciado.
- **No** dar por aprobada una publicación futura porque se aprobó una anterior.

---

## 3. Antes de publicar

No se publica trabajo sin verificar. Como mínimo, en verde:

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm audit
```

Si algo falla o queda a medias, **se dice explícitamente** en lugar de publicar y confiar en que
alguien lo note. Un dato que se sabe incompleto no se publica sin advertirlo.

---

## 4. Commits

- **Temáticos, no monolíticos.** Un commit resuelve una cosa; un cambio grande se reparte en varios
  commits legibles por separado en lugar de uno con todo dentro.
- **En español**, en modo imperativo y describiendo el *porqué*, no solo el *qué*. El diff ya dice
  qué cambió; el mensaje explica la razón y lo que se descartó.
- Cuando el cambio corrige un fallo, el mensaje incluye **su alcance medido** (cuántos registros,
  qué porcentaje), no una descripción vaga.

---

## 5. Qué se versiona

- **Sí:** código, documentación, los libros de `data/` (fuente de verdad) y el dataset generado
  `src/data/om-rxd.json`, que el build necesita.
- **No:** artefactos regenerables (`data-limpio/`, `test-results/`, `playwright-report/`),
  dependencias y archivos temporales de Excel (`~$*.xlsx`).

Ante la duda sobre versionar datos que contengan nombres de personas u otra información sensible,
**se pregunta antes**, no después.

---

## 6. Repositorio remoto

- Un único `origin`. Cambiar su URL es una operación que requiere confirmación.
- Al renombrar el repositorio en GitHub, actualizar el remoto local: los redireccionamientos
  funcionan, pero enmascaran a dónde se está publicando realmente.

---

## 7. Criterios de aceptación

La implementación cumple esta regla cuando:

- Ninguna publicación ocurre sin una confirmación explícita e inmediata.
- `permissions.ask` de `.claude/settings.json` cubre los comandos listados en §2.
- El historial se lee como una secuencia de cambios con propósito, no como volcados.
- Lo publicado está verificado, o sus limitaciones están dichas en voz alta.
