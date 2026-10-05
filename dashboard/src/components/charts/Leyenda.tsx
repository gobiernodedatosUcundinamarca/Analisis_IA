export interface ItemLeyenda {
  etiqueta: string;
  /** Color de la marca (token CSS). */
  color: string;
}

/**
 * Leyenda de series: muestra de color junto a texto en tinta neutra (el texto nunca toma el color de la serie).
 *
 * @example
 * <Leyenda items={[{ etiqueta: "Uso actual", color: SERIE_1 }]} />
 */
export function Leyenda({ items }: { items: ItemLeyenda[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-uc-text-secondary" aria-label="Leyenda">
      {items.map((it) => (
        <li key={it.etiqueta} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-3 rounded-[3px]" style={{ background: it.color }} />
          {it.etiqueta}
        </li>
      ))}
    </ul>
  );
}
