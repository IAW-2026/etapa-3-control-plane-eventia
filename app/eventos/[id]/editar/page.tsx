import { notFound } from 'next/navigation';
import BotonVolver from '@/app/_componentes/botones/BotonVolver';
import EditarEventoForm from './EditarEventoForm';

async function fetchEvento(id: number) {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/eventos`, {
    headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  const lista = Array.isArray(data) ? data : (data.eventos ?? data.data ?? data.results ?? []);
  return lista.find((e: { idEvento: number }) => e.idEvento === id) ?? null;
}

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idEvento = Number(id);
  if (!Number.isInteger(idEvento) || idEvento <= 0) notFound();

  const evento = await fetchEvento(idEvento);
  if (!evento) notFound();

  return (
    <div className="min-h-screen" style={{ background: '#fcf4e5' }}>
      <div className="px-3 pt-5 sm:px-5 lg:px-8">
        <BotonVolver />
      </div>
      <EditarEventoForm idEvento={idEvento} evento={evento} />
    </div>
  );
}
