'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateEntryModal({ isOpen, onClose, onSuccess }: CreateEntryModalProps) {
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [userId, setUserId] = useState('');

  const { data: users, isLoading: usersLoading } = trpc.user.getAll.useQuery(undefined, {
    enabled: isOpen,
  });

  const utils = trpc.useUtils();
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.invalidate();
      onSuccess?.();
      handleClose();
    },
  });

  const handleClose = () => {
    setDescription('');
    setStartTime('');
    setEndTime('');
    setUserId('');
    createTask.reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !startTime || !userId) return;
    createTask.mutate({
      description: description.trim(),
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
      userId,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-rema-dark/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nova Atividade</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha os dados da atividade</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-rema-cream transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={usersLoading}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{usersLoading ? 'Carregando...' : 'Selecione um usuário...'}</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.setor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a atividade realizada..."
              rows={3}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Término</label>
              <span className="text-xs text-gray-400">Opcional — deixe vazio para &quot;em andamento&quot;</span>
            </div>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent"
            />
          </div>

          {endTime ? (
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <p className="text-xs text-green-700">
                Atividade será registrada como <span className="font-semibold">Concluída</span>.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-rema-cream rounded-lg px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-rema-orange animate-pulse flex-shrink-0" />
              <p className="text-xs text-rema-rust">
                Sem término, a atividade ficará como <span className="font-semibold">Em andamento</span>.
              </p>
            </div>
          )}

          {createTask.isError && (
            <p className="text-xs text-red-500 text-center">Erro ao criar atividade. Tente novamente.</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={createTask.isPending}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-rema-cream transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createTask.isPending || !description.trim() || !startTime || !userId}
              className="flex-1 px-4 py-2 bg-rema-orange text-white rounded-lg text-sm font-medium hover:bg-rema-rust transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTask.isPending ? 'Criando...' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
