'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Activity, TaskStatus } from '@/types/activity';

interface EditEntryModalProps {
  task: Activity | null;
  onClose: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'COMPLETED', label: 'Concluída' },
  { value: 'CANCELLED', label: 'Cancelada' },
];

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditEntryModal({ task, onClose }: EditEntryModalProps) {
  const isOpen = task !== null;

  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('IN_PROGRESS');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (task) {
      setUserId(task.user.id);
      setStatus(task.status);
      setEndTime(task.endTime ? toDatetimeLocal(task.endTime) : '');
    }
  }, [task]);

  const handleStatusChange = (next: TaskStatus) => {
    setStatus(next);
    if (next === 'COMPLETED' && !endTime) {
      setEndTime(toDatetimeLocal(new Date()));
    }
  };

  const { data: users, isLoading: usersLoading } = trpc.user.getAll.useQuery(undefined, {
    enabled: isOpen,
  });

  const utils = trpc.useUtils();
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.invalidate();
      handleClose();
    },
  });

  const handleClose = () => {
    setEndTime('');
    updateTask.reset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    updateTask.mutate({
      id: task.id,
      userId,
      status,
      endTime: status === 'COMPLETED' ? new Date(endTime) : null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-rema-dark/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Editar Atividade</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-52">{task!.description}</p>
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
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.setor}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(opt.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    status === opt.value
                      ? opt.value === 'CANCELLED'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : opt.value === 'COMPLETED'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-rema-orange/10 text-rema-orange border-rema-orange/40'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {status === 'COMPLETED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Concluída em</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}

          {updateTask.isError && (
            <p className="text-xs text-red-500 text-center">Erro ao atualizar. Tente novamente.</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={updateTask.isPending}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-rema-cream transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateTask.isPending || !userId || (status === 'COMPLETED' && !endTime)}
              className="flex-1 px-4 py-2 bg-rema-orange text-white rounded-lg text-sm font-medium hover:bg-rema-rust transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateTask.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
