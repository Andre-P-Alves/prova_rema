'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { FilterBar } from '@/components/taskboard/FilterBar';
import { TaskBoard } from '@/components/taskboard/TaskBoard';
import { mockCurrentUser, mockActivities } from '@/data/mockActivities';
import { Activity, FilterState } from '@/types/activity';

export function MainLayout() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
  });

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesDesc = activity.description.toLowerCase().includes(q);
        const matchesUser = activity.user.name.toLowerCase().includes(q);
        if (!matchesDesc && !matchesUser) return false;
      }

      if (filters.startDate) {
        const startFilter = new Date(filters.startDate + 'T00:00:00');
        if (activity.startTime < startFilter) return false;
      }

      if (filters.endDate) {
        const endFilter = new Date(filters.endDate + 'T23:59:59');
        if (activity.startTime > endFilter) return false;
      }

      return true;
    });
  }, [activities, filters]);

  return (
    <div className="flex h-screen bg-rema-cream overflow-hidden">
      <Sidebar user={mockCurrentUser} />

      <main className="flex-1 flex flex-col min-w-0">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
        />

        <TaskBoard
          activities={filteredActivities}
        />
      </main>

    </div>
  );
}
