export interface User {
  id: string;
  name: string;
  email: string;
  setor: string;
  image?: string;
}

export interface Activity {
  id: string;
  startTime: Date;
  endTime?: Date;
  description: string;
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
