'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { modificarEvento } from '@/app/eventos/actions';
import CargaImagenes from '@/app/_componentes/cargaImagenes';
import { FileText, MapPin, Clock, Ticket, Image, Calendar } from 'lucide-react';
import ModalExito from '@/app/_componentes/ModalExito';

const CATEGORIAS = ['Arte', 'Deporte', 'Gastronomia', 'Musica', 'Tecnologia', 'Teatro', 'Otro'];

const LABEL = 'block text-[12px] font-bold uppercase tracking-[0.14em] text-[#6f5a50]';
const INPUT = 'h-12 w-full rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:h-14 sm:text-[16px]';
const INPUT_ICON = 'h-12 w-full rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] pl-11 pr-4 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:h-14 sm:text-[16px]';
const SECTION = 'space-y-4 rounded-[24px] border border-[#eadfd2] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:space-y-5 sm:p-5';

type Evento = {
  nombreEvento: string | null;
  descripcion: string | null;
  fecha: string | null;
  ubicacion: string | null;
  stock: number | null;
  precio: number | null;
  categoria: string | null;
  imagenes?: string[];
};


function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#eadfd2] pb-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-[#ff9aa0] text-[#7b0b0b]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-[18px] font-extrabold tracking-[-0.01em] text-[#222222] sm:text-[20px]">{title}</h2>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className={LABEL}>{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function EditarEventoForm({ idEvento, evento }: { idEvento: number; evento: Evento }) {
  const router = useRouter();

  const fechaLocal = evento.fecha ? new Date(evento.fecha) : null;
  const fechaDefault = fechaLocal
    ? `${fechaLocal.getFullYear()}-${String(fechaLocal.getMonth() + 1).padStart(2, '0')}-${String(fechaLocal.getDate()).padStart(2, '0')}`
    : '';
  const horaDefault = fechaLocal
    ? `${String(fechaLocal.getHours()).padStart(2, '00')}:${String(fechaLocal.getMinutes()).padStart(2, '00')}`
    : '';

  const ubicacion = evento.ubicacion ?? '';
  const partes = ubicacion.split(',');
  const ciudadInicial = partes.length > 1 ? partes.pop()?.trim() ?? '' : '';
  const direccionInicial = partes.join(',').trim();

  const [form, setForm] = useState({
    nombreEvento: evento.nombreEvento ?? '',
    descripcion: evento.descripcion ?? '',
    fecha: fechaDefault,
    hora: horaDefault,
    direccion: direccionInicial,
    ciudad: ciudadInicial,
    stock: evento.stock ?? '',
    precio: evento.precio ?? '',
    categoria: evento.categoria ?? CATEGORIAS[0],
  });
  const [imagenes, setImagenes] = useState<string[]>(evento.imagenes ?? []);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [exito, setExito] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');
    const fechaHoraUtc = new Date(`${form.fecha}T${form.hora}:00`).toISOString();
    const result = await modificarEvento(idEvento, {
      nombreEvento: form.nombreEvento,
      descripcion: form.descripcion,
      fecha: fechaHoraUtc,
      ubicacion: `${form.direccion}, ${form.ciudad}`,
      stock: Number(form.stock),
      precio: Number(form.precio),
      categoria: form.categoria,
      imagenes,
    });
    setLoading(false);
    if (!result.ok) {
      setSubmitError(result.error ?? 'Error al guardar');
    } else {
      setExito(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fcf4e5] px-3 py-5 sm:px-5 lg:px-8">
      {exito && (
        <ModalExito
          title="Evento modificado"
          message={<><span className="font-semibold text-[#650003]">{form.nombreEvento}</span> fue actualizado con exito.</>}
          onClose={() => router.push('/eventos')}
        />
      )}

      <div className="mb-4 sm:mb-5">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-[#8b1010] sm:text-[38px]">
          Editar Evento
        </h1>
        <p className="ml-1 mt-1 text-[12px] leading-[1.4] text-[#6e5549]">
          Modifica los detalles del evento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-[860px] space-y-4 sm:space-y-5">

        <section className={SECTION}>
          <SectionHeader icon={FileText} title="Informacion General" />

          <Field label="Nombre del Evento">
            <input
              name="nombreEvento"
              value={form.nombreEvento}
              onChange={handleChange}
              required
              placeholder="Ej. Gala de Verano 2026"
              className={INPUT}
            />
          </Field>

          <Field label="Descripcion">
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={5}
              placeholder="Describe los detalles de tu evento..."
              className="min-h-[96px] w-full resize-none rounded-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 py-3 text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:min-h-[112px] sm:py-4 sm:text-[16px]"
            />
          </Field>
        </section>

        <section className={SECTION}>
          <SectionHeader icon={MapPin} title="Fecha, Hora y Ubicacion" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Fecha">
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab6e6e]" />
                <input
                  name="fecha"
                  type="date"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                  className={INPUT_ICON}
                />
              </div>
            </Field>

            <Field label="Hora">
              <div className="relative">
                <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab6e6e]" />
                <input
                  name="hora"
                  type="time"
                  value={form.hora}
                  onChange={handleChange}
                  required
                  className={INPUT_ICON}
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Direccion">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ab6e6e]" />
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Ej. Av. Corrientes 1234"
                  className={INPUT_ICON}
                />
              </div>
            </Field>

            <Field label="Ciudad">
              <input
                name="ciudad"
                value={form.ciudad}
                onChange={handleChange}
                required
                placeholder="Ej. Bahia Blanca"
                className={INPUT}
              />
            </Field>
          </div>
        </section>

        <section className={SECTION}>
          <SectionHeader icon={Ticket} title="Configuracion y Entradas" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <Field label="Precio por Entrada">
              <div className="flex h-12 sm:h-14">
                <div className="flex items-center rounded-l-[16px] border border-r-0 border-[#ecd9c8] bg-[#fbf3e3] px-4 text-[16px] font-bold text-[#7b0b0b] sm:text-[18px]">
                  $
                </div>
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precio}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="flex-1 rounded-r-[16px] border border-[#ecd9c8] bg-[#fbf3e3] px-4 text-right text-[15px] text-[#5d4d45] outline-none transition placeholder:text-[#8b7269] focus:border-[#d7b9a3] focus:bg-[#fffaf0] sm:text-[16px]"
                />
              </div>
            </Field>

            <Field label="Capacidad Total">
              <input
                name="stock"
                type="number"
                min="1"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="100"
                className={INPUT}
              />
            </Field>

            <Field label="Categoria">
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className={INPUT}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className={SECTION}>
          <SectionHeader icon={Image} title="Multimedia" />
          <CargaImagenes onChange={setImagenes} initialUrls={imagenes} />
        </section>

        {submitError && (
          <p className="rounded-[12px] bg-red-50 px-4 py-3 text-[13px] text-red-600">{submitError}</p>
        )}

        <div className="flex justify-end border-t border-[#eadfd2] pt-4 sm:pt-5">
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-[16px] bg-[#650003] px-8 font-bold text-white shadow-[0_10px_20px_rgba(101,0,3,0.22)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </form>
    </div>
  );
}
