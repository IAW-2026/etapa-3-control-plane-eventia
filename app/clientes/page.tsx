import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { ptSerif } from '@/app/_componentes/fonts';
import BotonVolver from '@/app/_componentes/botones/BotonVolver';
import { esAdmin } from '@/app/lib/rolAdmin';
import { ShieldAlert } from "lucide-react"; 
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: 'Eventia - Clientes',
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

  let clientes: Cliente[] = [];
  let error: string | null = null;

  try {
    clientes = await fetchClientes();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Error al cargar los clientes';
  }

  return (
    <div className="min-h-screen px-8 py-10 sm:px-14" style={{ background: '#fcf4e5' }}>
      <BotonVolver />
      <div className="mb-8">
        <h1
          className="font-display mt-1 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: '#650003' }}
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
          className="overflow-x-auto rounded-[16px] border bg-white"
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