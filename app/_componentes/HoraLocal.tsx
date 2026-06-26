'use client';

import { useEffect, useState } from 'react';

export default function HoraLocal({ fecha }: { fecha: string }) {
  const [hora, setHora] = useState('—');

  useEffect(() => {
    setHora(
      new Date(fecha).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    );
  }, [fecha]);

  return <span>{hora}</span>;
}
