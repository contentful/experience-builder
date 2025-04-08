import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import localFont from 'next/font/local';
import './globals.css';
import { ReactQueryProvider } from '@/app/providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'The Studio',
  description: 'Studio Experiences template for a marketing website.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
