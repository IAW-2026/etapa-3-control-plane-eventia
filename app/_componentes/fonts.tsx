import { Climate_Crisis, Bricolage_Grotesque, Manrope, PT_Serif } from 'next/font/google';

export const ffDisplay = Climate_Crisis({
  subsets: ['latin'],
  variable: '--ff-display',
  display: 'swap',
});

export const ffBody = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--ff-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const ffLabel = Manrope({
  subsets: ['latin'],
  variable: '--ff-label',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});
