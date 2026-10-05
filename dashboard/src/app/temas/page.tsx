import { redirect } from "next/navigation";

/** `/temas` no tiene contenido propio: la raíz decide qué vista abrir. */
export default function Temas() {
  redirect("/");
}
