import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import DevolverButton from '@/app/_componentes/botones/DevolverButton';
import Paginacion from '@/app/_componentes/Paginacion';
import PillEstado from '@/app/_componentes/PillEstado';
import BotonVolver from '@/app/_componentes/botones/BotonVolver';
import { esAdmin } from '@/app/lib/rolAdmin';
import { ShieldAlert } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Eventia - Pedidos',
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
  const lista = Array.isArray(data) ? data : (data.pedidos ?? data.data ?? data.results ?? []);
  return lista.sort((a: Pedido, b: Pedido) => a.idPedido - b.idPedido);
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


const ITEMS_POR_PAGINA = 10;

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const user = await currentUser();
  const publicMetadata = user?.publicMetadata;
  const admin = publicMetadata ? esAdmin(publicMetadata) : false;

  if (!admin) {
    return (
      <div className="eventia-page flex flex-col items-center justify-center p-6 text-center">
        <div className="eventia-card max-w-md flex flex-col items-center p-8 bg-[var(--color-surface-soft)]">
          
          <div className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-md">
            <ShieldAlert className="w-9 h-9 stroke-[2]" />
          </div>

          <h1 className="font-display text-3xl text-[var(--color-primary)] mb-3 uppercase tracking-tight">
            Acceso Restringido
          </h1>

          <p className="font-body text-sm text-[var(--color-text-muted)] max-w-sm mb-6 leading-relaxed">
            Este módulo está reservado exclusivamente para el personal de administración central de Eventia.
          </p> 

          <Link
            href="/"
            className="eventia-button eventia-button--accent w-full text-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }  


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

  const pagina = Math.max(1, Number(page) || 1);
  const totalPaginas = Math.ceil(pedidos.length / ITEMS_POR_PAGINA);
  const pedidosPaginados = pedidos.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen px-8 py-10 sm:px-14" style={{ background: '#fcf4e5' }}>
      <BotonVolver />
      <div className="mb-8">
        <h1
          className="font-display mt-1 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#650003' }}
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
          className="rounded-[16px] border bg-white"
          style={{ borderColor: '#eadfd2' }}
        >
          <div className="overflow-x-auto">
            <PedidosTable pedidos={pedidosPaginados} orgMap={orgMap} />
          </div>
          <Suspense fallback={null}>
            <Paginacion totalPaginas={totalPaginas} />
          </Suspense>
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
                {p.monto != null ? `$${p.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '—'}
              </td>
              <td className={`${CELL} text-center`}>
                <PillEstado estado={p.estado} />
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
