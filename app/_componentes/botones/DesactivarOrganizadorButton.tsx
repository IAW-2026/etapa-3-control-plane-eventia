'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { desactivarOrganizador } from '@/app/organizadores/actions';
import ModalExito from '@/app/_componentes/ModalExito';

type Props = {
  idOrganizador: string;
  disabled?: boolean;
};

export default function DesactivarOrganizadorButton({ idOrganizador, disabled = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    const result = await desactivarOrganizador(idOrganizador);
    setLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error ?? 'Error al desactivar');
    } else {
      setExito(true);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <>
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

      {exito && (
        <ModalExito
          title="Organizador desactivado"
          message="El organizador fue desactivado con exito."
          onClose={() => { setExito(false); router.refresh(); }}
        />
      )}

      {errorMsg && (
        <ModalExito
          variant="error"
          title="No se pudo desactivar"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}
    </>
  );
}
