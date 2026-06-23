'use client';

import { useState } from 'react';
import { desactivarOrganizador } from '@/app/organizadores/actions';

type Props = {
  idOrganizador: string;
  disabled?: boolean;
};

export default function DesactivarOrganizadorButton({ idOrganizador, disabled = false }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await desactivarOrganizador(idOrganizador);
    if (!result.ok) alert(result.error ?? 'Error al desactivar');
    setLoading(false);
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-bold transition ${
        isDisabled
          ? 'cursor-not-allowed bg-[#e0d8d0] text-[#a89e96]'
          : 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-95'
      }`}
    >
      {loading ? '...' : 'Desactivar'}
    </button>
  );
}
