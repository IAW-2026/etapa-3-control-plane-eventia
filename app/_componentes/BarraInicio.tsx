'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={17} height={17}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

export default function BarraInicio() {
  const pathname = usePathname(); //devuelve url actual 
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 sm:px-9"
        style={{
          background: 'rgba(252, 244, 229, 0.88)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-xl p-2 transition hover:bg-[#f5e8e4] sm:hidden"
            aria-label="Abrir menú"
            style={{ color: 'var(--color-primary)' }}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-3 no-underline">
            <Image src="/logo.png" alt="Eventia logo" width={34} height={34} className="rounded-full" unoptimized />
            <span className="font-display text-[22px] tracking-[0.01em]" style={{ color: 'var(--color-primary)' }}>
              Eventia
            </span>
          </Link>
        </div>

        {pathname === '/' && (
          <div className="hidden items-center gap-8 sm:flex">
            <NavPill href="/" active={pathname === '/'} icon={<HomeIcon />}>Inicio</NavPill>
            {isSignedIn && (
              <NavPill href="/organizadores" active={false} icon={<LayoutDashboard size={17} />}>Panel</NavPill>
            )}
          </div>
        )}

        <div>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button
                className="font-label rounded-[11px] px-4 py-2 text-[14px] font-bold transition hover:brightness-95 hover:-translate-y-px"
                style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }}
              >
                Ingresar
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b px-4" style={{ borderColor: 'var(--color-border)' }}>
              <span className="font-label text-[12px] font-bold uppercase tracking-[0.14em] text-slate-400">Menú</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl p-2 transition hover:bg-[#faf0ee]"
                aria-label="Cerrar menú"
                style={{ color: 'var(--color-primary)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 py-4" onClick={() => setMobileMenuOpen(false)}>
              <Link
                href="/"
                className="mx-2 flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] font-medium transition-colors no-underline"
                style={pathname === '/'
                  ? { borderColor: 'var(--color-primary)', background: '#f5e8e4', color: 'var(--color-primary)' }
                  : { borderColor: 'transparent', color: '#5a3a35' }}
              >
                <HomeIcon /> Inicio
              </Link>
              {isSignedIn && (
                <Link
                  href="/organizadores"
                  className="mx-2 flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] font-medium transition-colors no-underline"
                  style={{ borderColor: 'transparent', color: '#5a3a35' }}
                >
                  <LayoutDashboard size={17} /> Panel
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavPill({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-label flex items-center gap-2 pb-[3px] text-[14px] font-semibold transition-colors"
      style={
        active
          ? { color: 'var(--color-primary)', borderBottom: '2px solid var(--color-primary)' }
          : { color: 'var(--color-text-muted)' }
      }
    >
      {icon}
      {children}
    </Link>
  );
}