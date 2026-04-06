import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import { Providers } from '@/lib/providers';
import './globals.css';

const mulish = Mulish({
  variable: '--font-family-primary',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'OP Video Engine',
  description:
    'Plataforma de generación automatizada de videos personalizados a escala — Omnicom Production'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('op-theme')||'{}');var d=t&&t.state&&t.state.theme==='light'?'':'dark';document.documentElement.classList.toggle('dark',d==='dark')}catch(e){document.documentElement.classList.add('dark')}})()`
          }}
        />
      </head>
      <body className={`${mulish.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
