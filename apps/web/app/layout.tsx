import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BotikaBantay - Presyo na Tama, Gamot na Tunay',
  description: 'Compare medicine prices and verify authenticity across Philippine pharmacies',
  keywords: ['medicine', 'price comparison', 'Philippines', 'pharmacy', 'FDA', 'verification'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
