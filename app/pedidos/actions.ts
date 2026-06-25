'use server';

import { revalidatePath } from 'next/cache';

export async function devolverPedido(idPedido: number): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.BUYER_BASE_URL!.trim().replace(/\/+$/, '');
  const res = await fetch(`${base}/api/buyer/datos/entradaDevuelta`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.BUYER_API_KEY!.trim(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idPedido: Number(idPedido) }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return { ok: false, error: data?.error ?? data?.message ?? `Error ${res.status}` };
  }

  revalidatePath('/pedidos');
  return { ok: true };
}
