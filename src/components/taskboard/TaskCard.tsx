import { Activity } from '@/types/activity';
import { formatTime, formatDate, getDuration } from '@/lib/utils';

interface TaskCardProps {
  activity: Activity;
  editMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
}

export function TaskCard({ activity, editMode, onDelete, onEdit }: TaskCardProps) {
  const status = activity.status ?? (activity.endTime === null ? 'IN_PROGRESS' : 'COMPLETED');
  const inProgress = status === 'IN_PROGRESS';
  const isCancelled = status === 'CANCELLED';
  const duration = getDuration(activity.startTime, activity.endTime);

  const initials = activity.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border p-4 w-72 flex-shrink-0 flex flex-col transition-all ${
        editMode
          ? 'border-red-300 ring-1 ring-red-100'
          : isCancelled
          ? 'border-gray-200 opacity-60'
          : inProgress
          ? 'border-rema-orange/40 ring-1 ring-rema-orange/10 hover:shadow-md'
          : 'border-gray-200 hover:shadow-md hover:border-rema-tan'
      }`}
    >
      {editMode && (
        <>
          <button
            onClick={() => onDelete(activity.id)}
            className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
            title="Excluir atividade"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(activity)}
            className="absolute -top-2.5 right-7 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md z-10"
            title="Editar atividade"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </>
      )}

      {/* Data + badge de status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-rema-orange">
          {formatDate(activity.startTime)}
        </span>

        {isCancelled ? (
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200">
            Cancelada
          </span>
        ) : inProgress ? (
          <span className="flex items-center gap-1.5 bg-rema-orange/10 text-rema-orange text-xs font-medium px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rema-orange animate-pulse" />
            Em andamento
          </span>
        ) : (
          <span className="bg-rema-cream text-rema-orange text-xs font-medium px-2 py-0.5 rounded-full border border-rema-tan/30">
            {duration}
          </span>
        )}
      </div>

      {/* Horários */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <svg className="w-3.5 h-3.5 text-rema-tan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{formatTime(activity.startTime)}</span>
        <span className="text-gray-400">→</span>
        {inProgress ? (
          <span className="text-rema-orange/60 italic text-xs">em aberto</span>
        ) : (
          <span>{activity.endTime ? formatTime(activity.endTime) : '—'}</span>
        )}
      </div>

      <div className="border-t border-gray-100 mb-3" />

      {/* Descrição */}
      <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-3">
        {activity.description}
      </p>

      {/* Usuário + Setor */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="w-6 h-6 rounded-full bg-rema-orange flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
          {initials}
        </div>
        <span className="text-xs text-gray-500 truncate flex-1">{activity.user.name}</span>
        <span className="text-xs bg-rema-cream text-rema-rust px-2 py-0.5 rounded-full border border-rema-tan/30 flex-shrink-0">
          {activity.user.setor}
        </span>
      </div>
    </div>
  );
}
