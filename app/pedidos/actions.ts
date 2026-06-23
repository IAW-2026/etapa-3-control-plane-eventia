'use server';

import { revalidatePath } from 'next/cache';

export async function devolverPedido(idPedido: number): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.BUYER_BASE_URL!.replace(/\/$/, '');
  await fetch(`${base}/api/buyer/datos/entradaDevuelta`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.BUYER_API_KEY!.trim(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idPedido: Number(idPedido) }),
  });

  revalidatePath('/pedidos');
  return { ok: true };
}
