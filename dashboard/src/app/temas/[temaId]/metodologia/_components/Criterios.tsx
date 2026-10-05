import { Explicacion } from "@/components/ui/Paneles";
import { N_MINIMO } from "@/lib/encuesta/EncuestaProvider";

/** Reglas con las que el tablero calcula y filtra los resultados. */
export function CriteriosCalculo() {
  return (
    <Explicacion titulo="Criterios de cálculo y de filtrado" abierta={false}>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong>Base de los porcentajes:</strong> las personas que respondieron cada pregunta. En selección múltiple los porcentajes suman
          más de 100 %.
        </li>
        <li>
          <strong>Filtros:</strong> entre preguntas distintas se combinan con «y»; dentro de una misma pregunta, con «o». Una gráfica no se
          filtra por su propia pregunta: muestra todas sus opciones y resalta las seleccionadas. Con menos de {N_MINIMO} respuestas aparece un
          aviso de muestra pequeña.
        </li>
        <li>
          <strong>Privacidad:</strong> los datos provienen del Excel anonimizado (sin correos ni nombres, y con las unidades de menos de 3
          respuestas agrupadas). El tablero no incluye la unidad ni las respuestas abiertas de cada persona.
        </li>
        <li>
          <strong>Limpieza:</strong> se unificaron variantes escritas a mano en el tipo de funciones y las respuestas «Otro» se agrupan como
          «Otra respuesta».
        </li>
      </ul>
    </Explicacion>
  );
}
