import type { Metadata } from "next";
import { VistaMetodologia } from "./_components/VistaMetodologia";

export const metadata: Metadata = { title: "Metodología y ficha técnica" };

export default function Metodologia() {
  return <VistaMetodologia />;
}
