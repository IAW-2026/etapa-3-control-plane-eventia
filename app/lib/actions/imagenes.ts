'use server';

import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function eliminarImagenAction(url: string) {
  const key = url.split('/').pop();
  if (!key) return;
  await utapi.deleteFiles(key);
}
