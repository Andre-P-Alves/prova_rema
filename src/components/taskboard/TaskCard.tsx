import { Activity } from '@/types/activity';
import { formatTime, formatDate, getDuration } from '@/lib/utils';

interface TaskCardProps {
  activity: Activity;
}

export function TaskCard({ activity }: TaskCardProps) {
  const duration = getDuration(activity.startTime, activity.endTime);

  const initials = activity.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative bg-white rounded-xl shadow-sm border p-4 w-72 flex-shrink-0 flex flex-col transition-all border-gray-200 hover:shadow-md hover:border-rema-tan'
      }`}
    >

      {/* Data e duração */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-rema-orange">
          {formatDate(activity.startTime)}
        </span>
        <span className="bg-rema-cream text-rema-orange text-xs font-medium px-2 py-0.5 rounded-full border border-rema-tan/30">
          {duration}
        </span>
      </div>

      {/* Horários */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <svg className="w-3.5 h-3.5 text-rema-tan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{formatTime(activity.startTime)}</span>
        <span className="text-gray-400">→</span>
        <span>{formatTime(activity.endTime)}</span>
      </div>

      <div className="border-t border-gray-100 mb-3" />

      {/* Descrição */}
      <p className="text-sm text-gray-700 leading-relaxed flex-1 line-clamp-3">
        {activity.description}
      </p>

      {/* Usuário */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="w-6 h-6 rounded-full bg-rema-orange flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
          {initials}
        </div>
        <span className="text-xs text-gray-500 truncate">{activity.user.name}</span>
      </div>
    </div>
  );
}
