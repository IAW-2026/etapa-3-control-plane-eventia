'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { ptSerif } from '@/app/_componentes/fonts';

type Props = {
  title: string;
  message: React.ReactNode;
  onClose: () => void;
  variant?: 'exito' | 'error';
};

export default function ModalExito({ title, message, onClose, variant = 'exito' }: Props) {
  const isError = variant === 'error';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1713]/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[24px] border border-[#eadfd2] bg-[#fcf4e5] p-6 text-center shadow-[0_20px_50px_rgba(55,32,20,0.18)]">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: isError ? '#fde3d4' : '#ff9aa0', color: '#7b0b0b' }}
        >
          {isError
            ? <XCircle className="h-7 w-7" />
            : <CheckCircle2 className="h-7 w-7" />}
        </div>
        <h3 className={`${ptSerif.className} text-[22px] leading-tight tracking-[-0.01em] text-[#111111]`}>
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#6e5549]">{message}</p>
        <button
          onClick={onClose}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#650003] px-6 text-[13px] font-semibold text-white transition hover:bg-[#7d0004]"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
