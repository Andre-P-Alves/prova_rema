// Layout raiz. Async Server Component — pré-carrega a sessão para evitar flash de loading no SessionProvider.
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { TRPCProvider } from '@/lib/trpc/provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'REMA — Registro de Atividades',
  description: 'Sistema de registro e monitoramento de atividades',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
