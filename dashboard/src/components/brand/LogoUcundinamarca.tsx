import Image from "next/image";

const VARIANTES = {
  "horizontal-blanco": { src: "/brand/imagotipo-horizontal-blanco.png", ancho: 1839, alto: 570 },
  "horizontal-negro": { src: "/brand/imagotipo-horizontal-negro.png", ancho: 1839, alto: 570 },
  "vertical-blanco": { src: "/brand/imagotipo-vertical-blanco.png", ancho: 685, alto: 723 },
} as const;

export type VarianteLogo = keyof typeof VARIANTES;

interface LogoUcundinamarcaProps {
  /**
   * Versión del imagotipo. Las interfaces digitales usan el imagotipo monocromático
   * (REGLAS_VISUALES_UCUNDINAMARCA §2.1): blanco sobre verde, negro sobre fondo claro;
   * el vertical solo cuando el espacio es reducido.
   */
  variante: VarianteLogo;
  /** Clases de tamaño (alto/ancho). La proporción se conserva siempre con `object-contain`. */
  className?: string;
  priority?: boolean;
}

/**
 * Imagotipo oficial de la Universidad de Cundinamarca. Único componente que muestra el logo,
 * para no duplicar reglas de identidad (regla de layouts §10.2).
 *
 * @example
 * <LogoUcundinamarca variante="horizontal-negro" className="h-12 w-auto" />
 */
export function LogoUcundinamarca({ variante, className = "", priority = false }: LogoUcundinamarcaProps) {
  const v = VARIANTES[variante];
  return (
    <Image
      src={v.src}
      width={v.ancho}
      height={v.alto}
      alt="Universidad de Cundinamarca"
      priority={priority}
      className={`object-contain ${className}`}
    />
  );
}
