import type { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { ptSerif } from '@/app/_componentes/fonts';

export const metadata: Metadata = {
  title: 'Eventos - Eventia',
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

export default async function EventosPage() {
  let eventos: Evento[] = [];
  let error: string | null = null;

  try {
    eventos = await fetchEventos();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar los eventos';
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
          className="overflow-x-auto rounded-[16px] border"
          style={{ borderColor: '#eadfd2' }}
        >
          <EventosTable eventos={eventos} />
        </div>
      )}
    </div>
  );
}

const CELL = 'border-r border-[#eadfd2] px-3 py-3 last:border-r-0';

function EventosTable({ eventos }: { eventos: Evento[] }) {
  const cols = ['Nombre', 'Organizador', 'Categoría', 'Ubicación', 'Fecha', 'Precio', 'Stock'];

  return (
    <table className="min-w-[820px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[18%]" />
        <col className="w-[16%]" />
        <col className="w-[13%]" />
        <col className="w-[17%]" />
        <col className="w-[11%]" />
        <col className="w-[11%]" />
        <col className="w-[14%]" />
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
            <td colSpan={7} className="px-4 py-12 text-center text-[#9b8074]">
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
                <td className={`${CELL} text-center text-[11px] font-semibold text-[#2c2a28]`}>
                  {ev.precio != null ? `$${ev.precio.toLocaleString('es-AR')}` : '—'}
                </td>
                <td className={`${CELL} text-center text-[11px] text-[#6f5a50]`}>
                  {ev.stock ?? '—'}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
