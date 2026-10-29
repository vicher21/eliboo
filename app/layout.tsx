import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EliBoo | Juguetes que hacen crecer momentos felices',
  description: 'Descubre juguetes tiernos, didácticos y llenos de imaginación en EliBoo.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
