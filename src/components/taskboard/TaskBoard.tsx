'use client';

import { Activity } from '@/types/activity';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  activities: Activity[];
  editMode: boolean;
  onDelete: (id: string) => void;
  selectedSetores: string[];
}

interface Group {
  label: string;
  items: Activity[];
}

function groupActivities(activities: Activity[], selectedSetores: string[]): Group[] {
  const groups = new Map<string, Group>();

  for (const activity of activities) {
    const key =
      selectedSetores.length === 1 ? activity.user.id : activity.user.setor;
    const label =
      selectedSetores.length === 1 ? activity.user.name : activity.user.setor;

    if (!groups.has(key)) {
      groups.set(key, { label, items: [] });
    }
    groups.get(key)!.items.push(activity);
  }

  return Array.from(groups.values());
}

export function TaskBoard({ activities, editMode, onDelete, selectedSetores }: TaskBoardProps) {
  if (activities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-rema-cream">
        <div className="text-center">
          <svg className="w-12 h-12 text-rema-tan/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-400 text-sm font-medium">Nenhuma atividade encontrada</p>
          <p className="text-gray-300 text-xs mt-1">Ajuste os filtros ou crie uma nova atividade</p>
        </div>
      </div>
    );
  }

  const groups = groupActivities(activities, selectedSetores);

  return (
    <div className="flex-1 overflow-y-auto bg-rema-cream">
      {editMode && (
        <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-700">
            <span className="font-semibold">Modo de edição ativo</span> — Clique no{' '}
            <span className="font-semibold">×</span> para excluir uma atividade.
          </p>
        </div>
      )}

      <div className="p-6 space-y-8">
        {groups.map((group) => (
          <section key={group.label}>
            {/* Cabeçalho do grupo */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-semibold text-gray-500 whitespace-nowrap">
                {group.label}
              </h2>
              <div className="flex-1 h-px bg-gray-300/60" />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {group.items.length} {group.items.length === 1 ? 'atividade' : 'atividades'}
              </span>
            </div>

            {/* Linha horizontal de cards com scroll */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {group.items.map((activity) => (
                <TaskCard
                  key={activity.id}
                  activity={activity}
                  editMode={editMode}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
