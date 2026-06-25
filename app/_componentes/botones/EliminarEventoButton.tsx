'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eliminarEvento } from '@/app/eventos/actions';
import DialogoConfirmacion from '@/app/_componentes/DialogoConfirmacion';
import ModalExito from '@/app/_componentes/ModalExito';

export default function EliminarEventoButton({ idEvento }: { idEvento: number }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = async () => {
    setAbierto(false);
    setLoading(true);
    const result = await eliminarEvento(idEvento);
    setLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error ?? 'Error al eliminar');
    } else {
      setExito(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        disabled={loading}
        className={`inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-bold transition ${
          loading
            ? 'cursor-not-allowed bg-[#e0d8d0] text-[#a89e96]'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        {loading ? '...' : 'Eliminar'}
      </button>

      <DialogoConfirmacion
        open={abierto}
        title="Eliminar evento"
        message="¿Seguro que queres eliminar este evento? Esta accion no se puede deshacer."
        confirmLabel="Si, eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setAbierto(false)}
      />

      {exito && (
        <ModalExito
          title="Evento eliminado"
          message="El evento fue eliminado con exito."
          onClose={() => { setExito(false); router.refresh(); }}
        />
      )}

      {errorMsg && (
        <ModalExito
          variant="error"
          title="No se pudo eliminar"
          message={errorMsg}
          onClose={() => setErrorMsg(null)}
        />
      )}
    </>
  );
}
