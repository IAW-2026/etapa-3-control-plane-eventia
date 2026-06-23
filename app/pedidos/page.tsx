import type { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import DevolverButton from '@/app/_componentes/botones/DevolverButton';

export const metadata: Metadata = {
  title: 'Pedidos - Eventia',
  description: 'Todos los pedidos registrados en la plataforma.',
};

type EstadoPedido = 'PENDIENTE' | 'PAGADO' | 'CANCELADO';

type Pedido = {
  idPedido: number;
  idOrganizador: string;
  idUsuario: string | null;
  idEvento: number;
  cantEntradas: number;
  monto: number;
  estado: EstadoPedido;
};

async function fetchPedidos(): Promise<Pedido[]> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/pedidos`, {
    headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.pedidos ?? data.data ?? data.results ?? []);
}

async function fetchNombresOrganizadores(): Promise<Map<string, string>> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/organizadores`, {
    headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    cache: 'no-store',
  });
  if (!res.ok) return new Map();
  const data = await res.json();
  const lista = Array.isArray(data) ? data : (data.organizadores ?? data.data ?? data.results ?? []);
  return new Map(
    lista.map((o: { idOrganizador: string; nombreOrganizador?: string | null; apellido?: string | null }) => [
      o.idOrganizador,
      `${o.nombreOrganizador ?? ''} ${o.apellido ?? ''}`.trim() || o.idOrganizador,
    ])
  );
}


export default async function PedidosPage() {
  let pedidos: Pedido[] = [];
  let error: string | null = null;
  let orgMap = new Map<string, string>();

  try {
    [pedidos, orgMap] = await Promise.all([
      fetchPedidos(),
      fetchNombresOrganizadores(),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar los pedidos';
  }

  return (
    <div className="px-8 py-10 sm:px-14">
      <div className="mb-8">
        <span
          className="font-label mb-3 inline-flex items-center rounded-full px-[14px] py-[7px] text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          Control Plane
        </span>
        <h1
          className="font-display mt-1 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: 'var(--color-ink)' }}
        >
          Pedidos
        </h1>
        <p className="font-body mt-2 text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {error
            ? 'No se pudieron cargar los datos.'
            : `${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''} registrado${pedidos.length !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {error ? (
        <div
          className="flex items-center gap-3 rounded-[16px] border p-5 text-[14px]"
          style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', background: 'rgba(254,158,162,0.12)' }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-[16px] border"
          style={{ borderColor: '#eadfd2' }}
        >
          <PedidosTable pedidos={pedidos} orgMap={orgMap} />
        </div>
      )}
    </div>
  );
}

const CELL = 'border-r border-[#eadfd2] px-3 py-3 last:border-r-0';

function PedidosTable({
  pedidos,
  orgMap,
}: {
  pedidos: Pedido[];
  orgMap: Map<string, string>;
}) {
  const cols = ['# Pedido', 'Organizador', 'Usuario', 'ID Evento', 'Entradas', 'Monto', 'Estado', 'Accion'];

  return (
    <table className="min-w-[900px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[10%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[10%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[13%]" />
        <col className="w-[15%]" />
      </colgroup>
      <thead>
        <tr
          className="text-[11px] uppercase tracking-[0.12em] text-[#b38c7d]"
          style={{ borderBottom: '1px solid #eadfd2' }}
        >
          {cols.map((col) => (
            <th key={col} className={`${CELL} text-center font-label whitespace-nowrap`}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#ebdfd4]">
        {pedidos.length === 0 ? (
          <tr>
            <td colSpan={8} className="px-4 py-12 text-center text-[#9b8074]">
              No hay pedidos registrados.
            </td>
          </tr>
        ) : (
          pedidos.map((p) => (
            <tr key={p.idPedido} className="transition hover:bg-[#ffe8e8]/40">
              <td className={`${CELL} text-center text-[11px] font-semibold text-[var(--color-primary)]`}>
                #{p.idPedido}
              </td>
              <td className={`${CELL} truncate text-center text-[11px] text-[#6f5a50]`}>
                {orgMap.get(p.idOrganizador) ?? p.idOrganizador}
              </td>
              <td className={`${CELL} truncate text-center text-[11px] text-[#6f5a50]`}>
                {p.idUsuario ?? '—'}
              </td>
              <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                {p.idEvento}
              </td>
              <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                {p.cantEntradas}
              </td>
              <td className={`${CELL} text-center text-[11px] font-semibold text-[#2c2a28]`}>
                ${p.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                {p.estado}
              </td>
              <td className={`${CELL} text-center`}>
                <DevolverButton idPedido={p.idPedido} disabled={p.estado === 'CANCELADO'} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
