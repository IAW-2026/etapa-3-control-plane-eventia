import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ptSerif } from '@/app/_componentes/fonts';
import BotonVolver from '@/app/_componentes/botones/BotonVolver';
import { esAdmin } from '@/app/lib/rolAdmin';
import { ShieldAlert } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import EliminarEventoButton from '@/app/_componentes/botones/EliminarEventoButton';
import HoraLocal from '@/app/_componentes/HoraLocal';
import Paginacion from '@/app/_componentes/Paginacion';

export const metadata: Metadata = {
  title: 'Eventia - Eventos',
  description: 'Todos los eventos publicados en la plataforma.',
};

type Evento = {
  idEvento: number;
  nombreEvento: string | null;
  fecha: string | null;
  ubicacion: string | null;
  stock: number | null;
  idOrganizador: string;
  organizador?: { nombreOrganizador: string | null; apellido: string | null } | null;
  precio: number | null;
  categoria: string | null;
};

async function fetchEventos(): Promise<Evento[]> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/eventos`, {
    headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

  const data = await res.json();
  return Array.isArray(data) ? data : (data.eventos ?? data.data ?? data.results ?? []);
}

const ITEMS_POR_PAGINA = 10;

export default async function EventosPage({
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


  let eventos: Evento[] = [];
  let error: string | null = null;

  try {
    eventos = await fetchEventos();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar los eventos';
  }

  const pagina = Math.max(1, Number(page) || 1);
  const totalPaginas = Math.ceil(eventos.length / ITEMS_POR_PAGINA);
  const eventosPaginados = eventos.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen px-8 py-10 sm:px-14" style={{ background: '#fcf4e5' }}>
      <BotonVolver />
      <div className="mb-8">
        <h1
          className="font-display mt-1 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#650003' }}
        >
          Eventos
        </h1>
        <p className="font-body mt-2 text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {error
            ? 'No se pudieron cargar los datos.'
            : `${eventos.length} evento${eventos.length !== 1 ? 's' : ''} registrado${eventos.length !== 1 ? 's' : ''}.`}
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
            <EventosTable eventos={eventosPaginados} />
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

function EventosTable({ eventos }: { eventos: Evento[] }) {
  const cols = ['ID', 'Nombre', 'Organizador', 'Categoría', 'Ubicación', 'Fecha', 'Hora', 'Precio', 'Stock', 'Acción'];

  return (
    <table className="min-w-[900px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[5%]" />
        <col className="w-[13%]" />
        <col className="w-[11%]" />
        <col className="w-[9%]" />
        <col className="w-[12%]" />
        <col className="w-[9%]" />
        <col className="w-[7%]" />
        <col className="w-[8%]" />
        <col className="w-[7%]" />
        <col className="w-[19%]" />
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
        {eventos.length === 0 ? (
          <tr>
            <td colSpan={10} className="px-4 py-12 text-center text-[#9b8074]">
              No hay eventos registrados.
            </td>
          </tr>
        ) : (
          eventos.map((ev) => {
            const nombreOrg = ev.organizador
              ? `${ev.organizador.nombreOrganizador ?? ''} ${ev.organizador.apellido ?? ''}`.trim() || ev.idOrganizador
              : ev.idOrganizador;

            return (
              <tr key={ev.idEvento} className="transition hover:bg-[#ffe8e8]/40">
                <td className={`${CELL} text-center text-[11px] font-semibold text-[#9b8074]`}>
                  {ev.idEvento}
                </td>
                <td className={`${CELL} truncate text-center text-[11px] font-semibold leading-[1.2] text-[var(--color-primary)] ${ptSerif.className}`}>
                  {ev.nombreEvento ?? '—'}
                </td>
                <td className={`${CELL} truncate text-center text-[11px] text-[#6f5a50]`}>
                  {nombreOrg}
                </td>
                <td className={`${CELL} text-center`}>
                  <span className="inline-flex rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--color-accent-foreground)] whitespace-normal">
                    {ev.categoria ?? '—'}
                  </span>
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50] whitespace-normal`}>
                  {ev.ubicacion ?? '—'}
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                  {ev.fecha
                    ? new Date(ev.fecha).toLocaleDateString('es-AR', {
                        timeZone: 'America/Argentina/Buenos_Aires',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                  {ev.fecha ? <HoraLocal fecha={ev.fecha} /> : '—'}
                </td>
                <td className={`${CELL} text-center text-[11px] font-semibold text-[#2c2a28]`}>
                  {ev.precio != null ? `$${ev.precio.toLocaleString('es-AR')}` : '—'}
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                  {ev.stock ?? '—'}
                </td>
                <td className={`${CELL} text-center`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/eventos/${ev.idEvento}/editar`}
                      className="inline-flex h-5 items-center gap-1 rounded-full bg-[#f5e8e4] px-2 text-[9px] font-bold text-[#793338] no-underline transition hover:bg-[#eadfd2]"
                    >
                      Modificar
                    </Link>
                    <EliminarEventoButton idEvento={ev.idEvento} />
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
