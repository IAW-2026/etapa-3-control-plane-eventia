'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { NAV_ITEMS } from '@/app/_componentes/navItems';

export default function SidebarAdmin() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  if (!isSignedIn || pathname === '/') return null;

  return (
    <aside className="hidden md:flex w-56 shrink-0 sticky top-[4rem] h-[calc(100vh-4rem)] flex-col overflow-y-auto border-r border-[#e8ddd5] bg-[#fcf4e5] py-5">
      <span className="px-5 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b1010]">
        Control Plane
      </span>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`mx-2 flex items-center gap-2.5 border-l-[3px] rounded-r-lg px-4 py-2 text-[13px] font-medium transition-colors no-underline ${
              active
                ? 'border-[var(--color-primary)] bg-[#f5e8e4] text-[var(--color-primary)]'
                : 'border-transparent text-[#5a3a35] hover:bg-[#f5ede8]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
