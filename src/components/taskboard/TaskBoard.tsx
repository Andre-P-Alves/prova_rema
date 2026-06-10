'use client';

import { Activity } from '@/types/activity';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  activities: Activity[];
}

export function TaskBoard({ activities }: TaskBoardProps) {
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

  return (


      <div className="flex gap-4 overflow-x-auto pb-2">
        {activities.map((activity) => (
          <TaskCard
            key={activity.id}
            activity={activity}
          />
        ))}
      </div>

  );
}
