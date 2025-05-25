import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'WhatsApp Business Automation',
  description: 'Automate WhatsApp Business messaging from Excel contacts',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
