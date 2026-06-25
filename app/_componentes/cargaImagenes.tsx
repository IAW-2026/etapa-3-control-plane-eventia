'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useUploadThing } from '@/app/lib/uploadthing';
import { eliminarImagenAction } from '@/app/lib/actions/imagenes';
import { Upload, X, Loader2, Star } from 'lucide-react';

type Item = {
  id: string;
  display: string;
  real: string | null;
};

type Props = {
  onChange: (urls: string[]) => void;
  initialUrls?: string[];
};

export default function CargaImagenes({ onChange, initialUrls = [] }: Props) {
  const [items, setItems] = useState<Item[]>(initialUrls.map((url) => ({ id: crypto.randomUUID(), display: url, real: url })));
  const [uploading, setUploading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange(items.filter((i) => i.real !== null).map((i) => i.real!));
  }, [items, onChange]);

  const { startUpload } = useUploadThing('imagenesEvento', {
    onClientUploadComplete: (res) => {
      const nuevasUrls = res.map((f) => f.ufsUrl);
      setItems((prev) => {
        const updated = [...prev];
        let urlIdx = 0;
        for (let i = 0; i < updated.length && urlIdx < nuevasUrls.length; i++) {
          if (updated[i].real === null) {
            updated[i] = { ...updated[i], real: nuevasUrls[urlIdx++] };
          }
        }
        return updated;
      });
      setUploading(false);
    },
    onUploadError: (err) => {
      console.error('Error al subir imagen:', err);
      setUploading(false);
    },
  });

  const procesarArchivos = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const validas = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (validas.length === 0) return;
      const nuevosItems = validas.map((f) => ({ id: crypto.randomUUID(), display: URL.createObjectURL(f), real: null as string | null }));
      setItems((prev) => [...prev, ...nuevosItems]);
      setUploading(true);
      await startUpload(validas);
    },
    [startUpload],
  );

  const eliminar = async (idx: number) => {
    const item = items[idx];
    if (item.real) await eliminarImagenAction(item.real);
    if (item.display.startsWith('blob:')) URL.revokeObjectURL(item.display);
    setItems(items.filter((_, i) => i !== idx));
  };

  const setPortada = (idx: number) => {
    if (idx === 0) return;
    const updated = [...items];
    const [item] = updated.splice(idx, 1);
    updated.unshift(item);
    setItems(updated);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        aria-label="Cargar imágenes del evento"
        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-[#d9baa8] bg-[#fbf3e3] px-4 py-10 transition-colors hover:border-[#c99c88] hover:bg-[#fff8ed] sm:px-6 sm:py-12 lg:py-14"
        onClick={() => document.getElementById('ut-input')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); procesarArchivos(e.dataTransfer.files); }}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ff9aa0] text-[#7b0b0b] shadow-[0_10px_20px_rgba(255,154,160,0.22)] sm:mb-5 sm:h-16 sm:w-16">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin sm:h-7 sm:w-7" /> : <Upload className="h-6 w-6 sm:h-7 sm:w-7" />}
        </div>
        <p className="text-center text-[18px] font-black text-[#222222] sm:text-[20px] lg:text-[22px]">
          {uploading ? 'Subiendo...' : 'Cargar Imágenes del Evento'}
        </p>
        <p className="mt-2 max-w-[320px] text-center text-[13px] text-[#8a7067] sm:text-[14px] lg:text-[15px]">
          Arrastrá y soltá archivos aquí o hacé clic para explorar
        </p>
        <input
          id="ut-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => procesarArchivos(e.target.files)}
        />
      </button>

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item, idx) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-[18px] border border-[#e6d3c2] shadow-sm">
              {item.real
                ? <Image src={item.real} alt={`Imagen ${idx + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw" unoptimized />
                : <img src={item.display} alt={`Imagen ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
              }
              {idx === 0 && (
                <div className="absolute left-2 top-2 rounded-full bg-[#f0d26f] px-2 py-1 text-[10px] font-bold text-[#6c5200]">Portada</div>
              )}
              {item.real === null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
              {item.real !== null && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                  {idx !== 0 && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPortada(idx); }} className="text-[#f5d76b] transition-transform hover:scale-125" aria-label={`Portada ${idx + 1}`}>
                      <Star className="h-5 w-5" />
                    </button>
                  )}
                  <button type="button" onClick={(e) => { e.stopPropagation(); eliminar(idx); }} className="text-white transition-transform hover:scale-125" aria-label={`Eliminar ${idx + 1}`}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
