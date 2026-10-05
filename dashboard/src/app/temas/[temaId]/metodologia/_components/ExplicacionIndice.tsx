"use client";

import { Explicacion } from "@/components/ui/Paneles";
import { useDatos } from "@/lib/encuesta/EncuestaProvider";

/** Cómo se calcula el índice de apropiación que usan la Síntesis del diagnóstico y el filtro «Nivel de apropiación». */
export function ExplicacionIndice() {
  const datos = useDatos();
  const catalogo = datos?.datos.catalogos;
  const actividades = (catalogo?.actividadesIndice ?? []).map(
    (id) => catalogo?.actividades.find((a) => a.id === id)?.etiqueta ?? id,
  );

  return (
    <Explicacion titulo="¿Cómo se calcula el índice de apropiación?" abierta={false}>
      <p>
        El índice (de 0 a 100) es una construcción propia de este análisis, no una pregunta de la encuesta. Se usa en la Síntesis del
        diagnóstico y en el filtro «Nivel de apropiación». Combina tres preguntas, cada una llevada a una escala de 0 a 1:
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-[36rem]">
          <thead>
            <tr>
              <th>Componente</th>
              <th>Pregunta</th>
              <th>Cómo se convierte</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Frecuencia de uso</strong></td>
              <td>P4</td>
              <td>Nunca = 0, Esporádicamente = 1, Varias veces al mes = 2, Varias veces por semana = 3, Todos o casi todos los días = 4. Se divide entre 4.</td>
              <td>40 %</td>
            </tr>
            <tr>
              <td><strong>Competencias</strong></td>
              <td>P8 a P12</td>
              <td>Ninguna = 0, Baja = 1, Media = 2, Alta = 3, Muy alta = 4. Se promedian las 5 competencias y se divide entre 4.</td>
              <td>40 %</td>
            </tr>
            <tr>
              <td><strong>Amplitud de uso</strong></td>
              <td>P6</td>
              <td>Se cuentan las actividades marcadas, con tope en 6, y se divide entre 6.</td>
              <td>20 %</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="rounded-xl bg-[var(--chart-pista)] px-4 py-3 text-center font-medium">
        Índice = (0,4 × frecuencia ÷ 4 + 0,4 × promedio de competencias ÷ 4 + 0,2 × mín(actividades; 6) ÷ 6) × 100
      </p>
      <p>
        <strong>Ejemplo:</strong> una persona que usa IA «Varias veces al mes» (2), se califica «Media» en las 5 competencias (promedio 2) y
        marcó 2 actividades obtiene 0,4 × 2/4 + 0,4 × 2/4 + 0,2 × 2/6 = 0,20 + 0,20 + 0,067 = 0,467, es decir, un índice de{" "}
        <strong>47 → Intermedio</strong>.
      </p>
      <p>
        <strong>Niveles:</strong> Inicial (0 a 25), Básico (más de 25 hasta 45), Intermedio (más de 45 hasta 65) y Avanzado (más de 65).
      </p>
      <p><strong>Detalles del cálculo</strong></p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          En amplitud solo se cuentan las {actividades.length || 9} actividades marcadas por al menos 30 personas
          {actividades.length > 0 ? ` (${actividades.join(", ")})` : ""}. No suman las respuestas escritas en «Otra» ni «Preparar reuniones,
          agendas o actas» (13 menciones).
        </li>
        <li>Si a una persona le falta una competencia, se promedian las que respondió (un caso).</li>
      </ul>
      <p><strong>¿Por qué esos pesos?</strong></p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Los tres componentes reflejan el objetivo del diagnóstico: <strong>uso</strong> (frecuencia), <strong>conocimiento</strong>{" "}
          (competencias) y <strong>apropiación</strong> (variedad de usos).
        </li>
        <li>
          Frecuencia y competencias pesan lo mismo (40 % cada una) porque no hay razón para que una importe más que la otra, y ambas se miden con
          una escala de 5 niveles.
        </li>
        <li>
          La amplitud pesa menos (20 %) y tiene tope en 6 porque marcar opciones en una lista es más fácil que usar la IA con frecuencia, y porque
          las actividades listadas encajan más con cargos de oficina: con más peso, el índice castigaría a quien tiene pocas tareas donde la IA
          aplica.
        </li>
        <li>
          Los pesos y los cortes de nivel los definió el analista y no están validados. Con otros pesos, los directivos siguen primeros y el
          personal asistencial último; lo que sí cambia con otros cortes es cuántas personas quedan en cada nivel.
        </li>
        <li>
          Todos los componentes son autorreportados: miden uso y competencia declarados, no desempeño real. El índice no incluye P7 (forma de
          uso), y una persona que nunca usa IA pero se califica «Media» en competencias obtiene 20 puntos.
        </li>
      </ul>
    </Explicacion>
  );
}
