import { redirect } from "next/navigation";
import { TEMAS } from "@/lib/temas";

/** Sin portada: la raíz abre directamente la primera vista del tema publicado. */
export default function Inicio() {
  const tema = TEMAS[0];
  redirect(`/temas/${tema.id}/${tema.vistas[0].id}`);
}
