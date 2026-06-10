import { User } from '@/types/activity';

interface UserInfoProps {
  user: User;
}

export function UserInfo({ user }: UserInfoProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-rema-dark-mid rounded-xl p-4 border border-rema-dark-mid">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-rema-orange flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm truncate">{user.name}</p>
          <p className="text-rema-tan text-xs truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-rema-tan text-xs">Online</span>
      </div>
    </div>
  );
}
