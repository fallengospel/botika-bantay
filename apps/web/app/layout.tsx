import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a',
};

export const metadata: Metadata = {
  title: 'BotikaBantay - Presyo na Tama, Gamot na Tunay',
  description: 'Compare medicine prices and verify authenticity across Philippine pharmacies. Presyo na Tama, Gamot na Tunay.',
  keywords: ['medicine', 'price comparison', 'Philippines', 'pharmacy', 'FDA', 'verification', 'botika', 'gamot', 'presyo'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BotikaBantay',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fil" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary-600 focus:font-medium"
        >
          Skip to content
        </a>
        <div className="min-h-screen flex flex-col bg-surface-50" id="main-content">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
