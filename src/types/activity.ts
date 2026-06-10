export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Activity {
  id: string;
  startTime: Date;
  endTime: Date;
  description: string;
  user: User;
  createdAt: Date;
}

export interface FilterState {
  search: string;
  startDate: string;
  endDate: string;
}
