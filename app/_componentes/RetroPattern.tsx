// Patrón retro de círculos solapados que generan estrellas de 4 puntas
// El prop id evita conflictos cuando hay múltiples instancias en la misma página
export default function RetroPattern({ tile = 92, id = 'retro' }: { tile?: number; id?: string }) {
  const r = tile * 0.54; // los círculos se solapan y dejan estrellas de 4 puntas
  const patternId = `retro-${id}`;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <rect width={tile} height={tile} fill="var(--color-pattern-bg)" />
          <circle cx={tile / 2} cy={tile / 2} r={r} fill="var(--color-pattern-dot)" />
          <circle cx={0}    cy={0}    r={r} fill="var(--color-pattern-dot)" />
          <circle cx={tile} cy={0}    r={r} fill="var(--color-pattern-dot)" />
          <circle cx={0}    cy={tile} r={r} fill="var(--color-pattern-dot)" />
          <circle cx={tile} cy={tile} r={r} fill="var(--color-pattern-dot)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
