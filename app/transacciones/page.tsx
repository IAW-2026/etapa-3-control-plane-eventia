import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import PillEstado from '@/app/_componentes/PillEstado';
import Paginacion from '@/app/_componentes/Paginacion';
import { ptSerif } from '@/app/_componentes/fonts';
import BotonVolver from '@/app/_componentes/botones/BotonVolver';
import { esAdmin } from '@/app/lib/rolAdmin';
import { ShieldAlert } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: 'Eventia - Transacciones',
  description: 'Todas las transacciones registradas en la plataforma.',
};

type Transaccion = {
  id_transaccion: string | number;
  id_pedido: string | number;
  monto: string | number;
  moneda: string;
  estado_transaccion: string;
};

async function fetchTransacciones(): Promise<Transaccion[]> {
  const base = process.env.PAYMENTS_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/payments/datos/transacciones`, {
    headers: { 'x-api-key': process.env.PAYMENTS_API_KEY!.trim() },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

  const data = await res.json();
  return Array.isArray(data) ? data : (data.transacciones ?? data.data ?? data.results ?? []);
}

const ITEMS_POR_PAGINA = 10;

export default async function TransaccionesPage({
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


  let transacciones: Transaccion[] = [];
  let error: string | null = null;

  try {
    transacciones = await fetchTransacciones();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar las transacciones';
  }

  const pagina = Math.max(1, Number(page) || 1);
  const totalPaginas = Math.ceil(transacciones.length / ITEMS_POR_PAGINA);
  const transaccionesPaginadas = transacciones.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen px-8 py-10 sm:px-14" style={{ background: '#fcf4e5' }}>
      <BotonVolver />
      <div className="mb-8">
        <h1
          className="font-display mt-1 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#650003' }}
        >
          Transacciones registradas
        </h1>
        <p className="font-body mt-2 text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {error
            ? 'No se pudieron cargar los datos.'
            : `${transacciones.length} transacción${transacciones.length !== 1 ? 's' : ''} registrada${transacciones.length !== 1 ? 's' : ''}.`}
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
            <TransaccionesTable transacciones={transaccionesPaginadas} />
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

function TransaccionesTable({ transacciones }: { transacciones: Transaccion[] }) {
  const cols = [ 'id_transaccion', 'id_pedido', 'monto', 'estado_transaccion', 'moneda'];

  return (
    <table className="min-w-[820px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[20%]" />
        <col className="w-[20%]" />
        <col className="w-[20%]" />
        <col className="w-[20%]" />
        <col className="w-[20%]" />
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
        {transacciones.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-12 text-center text-[#9b8074]">
              No hay transacciones registradas.
            </td>
          </tr>
        ) : (
          transacciones.map((trans) => {
            return (
              <tr key={trans.id_transaccion} className="transition hover:bg-[#ffe8e8]/40">
                <td className={`${CELL} truncate text-center text-[11px] font-semibold leading-[1.2] text-[var(--color-primary)] ${ptSerif.className}`}>
                  {trans.id_transaccion ?? '—'}
                </td>
                <td className={`${CELL} truncate text-center text-[11px] text-[#6f5a50]`}>
                  {trans.id_pedido ?? '—'}
                </td>
                <td className={`${CELL} text-center`}>
                    {trans.monto ?? '—'}
                </td>
                <td className={`${CELL} text-center`}>
                  <PillEstado estado={trans.estado_transaccion} />
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                  {trans.moneda ?? '—'}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}