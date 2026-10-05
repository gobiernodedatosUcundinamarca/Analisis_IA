import { redirect } from "next/navigation";

/** La entrada al tema abre su primera vista. */
export default async function InicioTema({ params }: PageProps<"/temas/[temaId]">) {
  const { temaId } = await params;
  redirect(`/temas/${temaId}/resumen`);
}
