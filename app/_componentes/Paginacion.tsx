'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Props = {
  totalPaginas: number;
};

export default function Paginacion({ totalPaginas }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const paginaActual = Number(searchParams.get('page')) || 1;

  if (totalPaginas <= 1) return null;

  function cambiarPagina(nuevaPagina: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', nuevaPagina.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[#eadfd2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="font-label text-[11px] text-[#9b7f74] sm:text-[13px]">
        Página{' '}
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-[8px] py-[1px] text-[11px] font-bold text-[var(--color-accent-foreground)] sm:px-[9px] sm:py-[2px] sm:text-[12px]">
          {paginaActual}
        </span>{' '}
        de <span className="font-bold text-[#4b3f38]">{totalPaginas}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={paginaActual <= 1}
          onClick={() => cambiarPagina(paginaActual - 1)}
          aria-label="Página anterior"
          className="font-label inline-flex h-9 items-center rounded-full border border-[#d8ccc1] bg-transparent px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5a3a35] transition hover:bg-[#f5ede6] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:px-5 sm:text-[11px]"
        >
          Anterior
        </button>
        <button
          disabled={paginaActual >= totalPaginas}
          onClick={() => cambiarPagina(paginaActual + 1)}
          aria-label="Página siguiente"
          className="font-label inline-flex h-9 items-center rounded-full bg-[var(--color-primary)] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:px-5 sm:text-[11px]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
