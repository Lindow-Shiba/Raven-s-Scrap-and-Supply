
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Culture Shock Invoice',
  description: 'Internal tool for tracking materials and receipts'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
