import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, UserCog, CreditCard, ShoppingCart, Ticket, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Eventia - Descubrí y creá eventos',
  description: 'La plataforma para organizar eventos y vender entradas de manera fácil y segura.',
};

export default function HomePage() {
  const createEventHref = '/organizador/eventos/nuevo';

  return (
    // Fondo: dos radiales suaves + crema base, igual al mockup
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(900px 600px at 85% -5%, rgba(254, 158, 162, 0.22), transparent 60%),
          radial-gradient(700px 500px at -5% 30%, rgba(101, 0, 3, 0.05), transparent 55%),
          var(--color-surface-alt)
        `,
      }}
    >
      
      <HeroSection createEventHref={createEventHref} />
      <FeaturesSection />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────────── */

function HeroSection({ createEventHref }: { createEventHref: string }) {
  return (
    <section className="grid min-h-[calc(100svh-72px)] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Columna izquierda: copy + CTA */}
      <div className="flex flex-col items-start justify-center gap-[22px] px-8 py-12 sm:px-14">
        <span
          className="font-label inline-flex items-center gap-2 rounded-full px-[14px] py-[7px] text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          Bienvenido a Eventia
        </span>

        <h1
          className="font-display leading-[0.92] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(40px,6.2vw,78px)', color: 'var(--color-ink)' }}
        >
          Descubrí,{' '}
          <span style={{ color: 'var(--color-primary)' }}>creá</span>{' '}
          y viví los mejores <span style={{ color: 'var(--color-primary)' }}>eventos</span>
        </h1>

        <p className="font-body max-w-[430px] text-[18px] leading-[1.6]" style={{ color: 'var(--color-text-muted)' }}>
          La plataforma para monitorear y gestionar eventos.
        </p>
        
      </div>

      {/* Columna derecha: imagen */}
      <div className="relative h-[260px] overflow-hidden lg:h-auto">
        <Image
          src="/imgHome.jpeg"
          alt="Imagen de evento"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </section>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: Users,        iconBg: 'var(--color-primary)',     title: 'clientes',      desc: 'Gestioná tu base de clientes y su historial de compras.',              href: '/clientes' },
  { icon: UserCog,      iconBg: 'var(--color-pattern-dot)', title: 'organizadores', desc: 'Administrá los organizadores y sus permisos dentro de la plataforma.', href: '/organizadores' },
  { icon: CreditCard,   iconBg: 'var(--color-primary)',     title: 'transacciones', desc: 'Seguí cada pago realizado por los clientes.',                          href: '/transacciones' },
  { icon: ShoppingCart, iconBg: 'var(--color-pattern-dot)', title: 'pedidos',       desc: 'Controlá el estado de los pedidos.',                                   href: '/pedidos' },
  { icon: Ticket,       iconBg: 'var(--color-primary)',     title: 'entradas',      desc: 'Visualizá las entradas vendidas de cada evento.',                       href: '/entradas' },
  { icon: CalendarDays, iconBg: 'var(--color-pattern-dot)', title: 'eventos',       desc: 'Administrá todos los eventos publicados en la plataforma.',             href: '/eventos' },
];

function FeaturesSection() {
  return (
    <section
      className="relative px-8 py-[72px] sm:px-14"
      style={{
        background: `
          radial-gradient(700px 380px at 12% 0%, rgba(254,158,162,.18), transparent 62%),
          linear-gradient(180deg, #f9f3e4, #f3eddf)
        `,
      }}
    >
      {/* Textura de puntitos a baja opacidad */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-primary) 1.4px, transparent 1.4px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Encabezado centrado */}
      <div className="relative mx-auto mb-[44px] max-w-[560px] text-center">
        <span
          className="font-label mb-4 inline-flex items-center rounded-full px-[14px] py-[7px] text-[11px] font-extrabold uppercase tracking-[0.14em]"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
        >
          Control Plane
        </span>
        <h2
          className="font-display mt-4 leading-[1] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(20px,2.6vw,32px)', color: 'var(--color-ink)' }}
        >
          Todo lo que necesitas para gestionar tus eventos en un solo lugar
        </h2>
      </div>

      {/* Grid de 6 cards */}
      <div className="relative grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, iconBg, title, desc, href }) => (
          <div
            key={title}
            className="flex flex-col justify-between rounded-[24px] border p-5 sm:p-[30px] transition hover:-translate-y-1"
            style={{
              background: 'linear-gradient(180deg, rgba(254, 158, 162, 0.22), var(--color-surface))',
              borderColor: 'var(--color-border)',
              boxShadow: 'var(--color-shadow)',
            }}
          >
            <div>
              <div
                className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-[15px] text-white"
                style={{ background: iconBg }}
              >
                <Icon size={26} strokeWidth={1.7} />
              </div>
              <h3 className="font-display text-[24px] leading-[1.05]" style={{ color: 'var(--color-ink)' }}>
                {title}
              </h3>
              <p className="font-body mt-[10px] text-[13px] leading-[1.5]" style={{ color: 'var(--color-text-muted)' }}>
                {desc}
              </p>
            </div>
            <div className="mt-[18px] flex justify-end">
              <Link
                href={href}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
                style={{ background: 'var(--color-primary)' }}
              >
                <ArrowRight size={15} className="text-white" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


