// Interfaces de domínio da aplicação: User, Activity, FilterState e TaskStatus.
export type TaskStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  setor: string;
  image?: string | null;
}

export interface Activity {
  id: string;
  startTime: Date;
  endTime: Date | null;
  description: string;
  status: TaskStatus;
  user: User;
  createdAt: Date;
}

export interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
  selectedUsers: string[];
  selectedSetores: string[];
  status: 'all' | 'in_progress' | 'completed';
}
