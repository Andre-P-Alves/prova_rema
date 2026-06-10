'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('E-mail ou senha inválidos.');
    }
  }

  return (
    <div className="min-h-screen bg-rema-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-rema-dark font-bold text-3xl tracking-tight">REMA</h1>
          <p className="text-rema-tan text-sm mt-1">Registro de Atividades</p>
        </div>

        <div className="bg-rema-dark rounded-2xl p-8 shadow-xl">
          <h2 className="text-white font-semibold text-lg mb-6">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-rema-tan text-sm mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-rema-dark-mid border border-rema-dark-mid text-white placeholder-rema-tan/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rema-orange transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-rema-tan text-sm mb-1.5">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-rema-dark-mid border border-rema-dark-mid text-white placeholder-rema-tan/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rema-orange transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rema-orange hover:bg-rema-rust text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
