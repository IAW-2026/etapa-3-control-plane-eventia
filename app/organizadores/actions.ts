'use server';

import { revalidatePath } from 'next/cache';

export async function activarOrganizador(idOrganizador: string): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');

  try {
    const res = await fetch(`${base}/api/seller/datos/organizadores/${idOrganizador}`, {
      method: 'PUT',
      headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error ?? data?.message ?? `Error ${res.status}` };
    }

    revalidatePath('/organizadores');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' };
  }
}

export async function desactivarOrganizador(idOrganizador: string): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.SELLER_BASE_URL!.replace(/\/$/, '');

  try {
    const res = await fetch(`${base}/api/seller/datos/organizadores/${idOrganizador}`, {
      method: 'PATCH',
      headers: { 'x-api-key': process.env.SELLER_API_KEY!.trim() },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error ?? data?.message ?? `Error ${res.status}` };
    }

    revalidatePath('/organizadores');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error desconocido' };
  }
}
