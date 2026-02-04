import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'جولة افتراضية في سوريا - Virtual Tour of Syria',
  description: 'جولة تفاعلية ثلاثية الأبعاد في المواقع التاريخية والطبيعية السورية',
  keywords: ['سوريا', 'جولة افتراضية', 'سياحة', 'تاريخ', 'آثار', 'بانوراما'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a2919" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}