'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { UserInfo } from './UserInfo';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Atividades',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    ),
  },
  {
    href: '/metricas',
    label: 'Métricas',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-rema-dark border-r border-rema-dark-mid flex flex-col p-4 flex-shrink-0">
      <div className="mb-6">
        <h1 className="text-white font-bold text-xl tracking-tight">REMA</h1>
        <p className="text-rema-tan text-xs mt-0.5">Registro de Atividades</p>
      </div>

      {session?.user ? (
        <UserInfo
          name={session.user.name ?? ''}
          email={session.user.email ?? ''}
          setor={session.user.setor}
        />
      ) : (
        <div className="bg-rema-dark-mid rounded-xl p-4 border border-rema-dark-mid animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-rema-orange/30 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/10 rounded w-3/4" />
              <div className="h-2 bg-white/10 rounded w-full" />
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded w-1/2" />
        </div>
      )}

      <nav className="mt-6 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-rema-dark-mid text-white'
                  : 'text-rema-tan/70 hover:bg-rema-dark-mid/60 hover:text-white'
              }`}
            >
              <svg
                className={`w-4 h-4 ${active ? 'text-rema-orange' : 'text-rema-tan/50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-rema-dark-mid pt-4 space-y-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rema-tan/70 hover:bg-rema-dark-mid/60 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 text-rema-tan/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
        <div className="text-rema-tan/40 text-xs text-center">v0.8.0</div>
      </div>
    </aside>
  );
}
