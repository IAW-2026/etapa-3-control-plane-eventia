'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BotonVolver() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-1 flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-[#793338] transition hover:bg-[#f5e8e4]"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      Volver
    </button>
  );
}
