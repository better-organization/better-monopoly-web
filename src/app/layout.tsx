import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Better Monopoly',
  description: 'A modern implementation of the classic Monopoly board game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
