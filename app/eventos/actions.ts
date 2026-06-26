'use server';

import { revalidatePath } from 'next/cache';

export async function eliminarEvento(idEvento: number): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/eventos/${idEvento}`, {
    method: 'DELETE',
    headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? `Error ${res.status}` };
  }

  revalidatePath('/eventos');
  return { ok: true };
}

export async function modificarEvento(
  idEvento: number,
  body: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');
  const res = await fetch(`${base}/api/seller/datos/eventos/${idEvento}`, {
    method: 'PUT',
    headers: {
      'x-api-key': process.env.SELLER_API_KEY!.trim(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? `Error ${res.status}` };
  }

  revalidatePath('/eventos');
  revalidatePath(`/eventos/${idEvento}/editar`);
  return { ok: true };
}
