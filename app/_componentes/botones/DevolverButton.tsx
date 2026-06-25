'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { devolverPedido } from '@/app/pedidos/actions';
import ModalExito from '@/app/_componentes/ModalExito';

type Props = {
  idPedido: number;
  disabled?: boolean;
};


export default function DevolverButton({ idPedido, disabled = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await devolverPedido(idPedido);
    setLoading(false);
    if (!result.ok) {
      alert(result.error ?? 'Error al devolver');
    } else {
      setExito(true);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <>
      {exito && (
        <ModalExito
          title="Pedido devuelto"
          message={<>El pedido <span className="font-semibold text-[#650003]">#{idPedido}</span> fue devuelto con exito.</>}
          onClose={() => { setExito(false); router.refresh(); }}
        />
      )}
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
        {loading ? '...' : 'Devolver'}
      </button>
    </>
  );
}
