import { Home, Users, UserCog, CreditCard, ShoppingCart, Ticket, CalendarDays } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/',              label: 'Inicio',        icon: Home },
  { href: '/organizadores', label: 'Organizadores', icon: UserCog },
  { href: '/eventos',       label: 'Eventos',       icon: CalendarDays },
  { href: '/pedidos',       label: 'Pedidos',       icon: ShoppingCart },
  { href: '/entradas',      label: 'Entradas',      icon: Ticket },
  { href: '/transacciones', label: 'Transacciones', icon: CreditCard },
  { href: '/clientes',      label: 'Clientes',      icon: Users },
];
