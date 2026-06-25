function getEstilo(estado: string): { bg: string; text: string } {
  const e = estado.toUpperCase();
  if (['PAGADO', 'APROBADO', 'APROBADA', 'CONFIRMADO', 'CONFIRMADA'].includes(e))
    return { bg: '#c8ddc8', text: '#2d5a2d' };   // sage suave — éxito
  if (['CANCELADO', 'CANCELADA'].includes(e))
    return { bg: '#e8b8b8', text: '#650003' };   // bordo claro — cancelado
  if (['FALLIDA', 'FALLIDO'].includes(e))
    return { bg: '#fde3d4', text: '#7b0b0b' };   // durazno/peach — fallida
  return { bg: '#f5d9a0', text: '#7a4500' };     // ámbar cálido — pendiente
}

export default function PillEstado({ estado }: { estado: string | null | undefined }) {
  if (!estado) return <span className="text-[#9b8074]">—</span>;
  const { bg, text } = getEstilo(estado);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
      style={{ background: bg, color: text }}
    >
      {estado}
    </span>
  );
}
