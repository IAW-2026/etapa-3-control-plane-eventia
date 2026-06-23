import type { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { ptSerif } from '@/app/_componentes/fonts';

export const metadata: Metadata = {
  title: 'Clientes - Eventia',
  description: 'Todos los clientes registrados en la plataforma.',
};

type Cliente = {
  id_usuario: string;
  nombre_usuario: string;
  mail: string;
  
};

async function fetchClientes(): Promise<Cliente[]> {
  const base = process.env.BUYER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/buyer/datos/clientes`, {
    headers: { 'x-api-key': process.env.BUYER_API_KEY!.trim() },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

  const data = await res.json();
  return Array.isArray(data) ? data : (data.clientes ?? data.data ?? data.results ?? []);
}

export default async function ClientesPage() {
  let clientes: Cliente[] = [];
  let error: string | null = null;

  try {
    clientes = await fetchClientes();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar los clientes';
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
          Clientes registrados
        </h1>
        <p className="font-body mt-2 text-[15px]" style={{ color: 'var(--color-text-muted)' }}>
          {error
            ? 'No se pudieron cargar los datos.'
            : `${clientes.length} cliente${clientes.length !== 1 ? 's' : ''} registrado${clientes.length !== 1 ? 's' : ''}.`}
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
          <ClientesTable clientes={clientes} />
        </div>
      )}
    </div>
  );
}

const CELL = 'border-r border-[#eadfd2] px-3 py-3 last:border-r-0';

function ClientesTable({ clientes }: { clientes: Cliente[] }) {
  const cols = [ 'nombre', 'id_cliente','email'];

  return (
    <table className="min-w-[820px] w-full table-fixed bg-transparent text-[11px]">
      <colgroup>
        <col className="w-[33%]" />
        <col className="w-[33%]" />
        <col className="w-[34%]" />
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
        {clientes.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-12 text-center text-[#9b8074]">
              No hay clientes registrados.
            </td>
          </tr>
        ) : (
          clientes.map((cli) => {
            return (
              <tr key={cli.nombre_usuario} className="transition hover:bg-[#ffe8e8]/40">
                 <td className={`${CELL} truncate text-center text-[11px] text-[#6f5a50]`}>
                  {cli.nombre_usuario ?? '—'}
                </td>
                <td className={`${CELL} truncate text-center text-[11px] font-semibold leading-[1.2] text-[var(--color-primary)] ${ptSerif.className}`}>
                  {cli.id_usuario ?? '—'}
                </td>
                <td className={`${CELL} text-center`}>
                  <span className="inline-flex rounded-full bg-[var(--color-accent)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--color-accent-foreground)] whitespace-normal">
                    {cli.mail ?? '—'}
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}