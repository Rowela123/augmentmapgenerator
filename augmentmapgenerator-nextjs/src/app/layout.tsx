import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'US Map Generator',
  description: 'Generate interactive US maps with custom data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
