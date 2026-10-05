import type { Metadata } from "next";
import { VistaResumen } from "./_components/VistaResumen";

export const metadata: Metadata = { title: "Síntesis del diagnóstico" };

export default function Resumen() {
  return <VistaResumen />;
}
