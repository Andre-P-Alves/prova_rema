'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { FilterBar } from '@/components/taskboard/FilterBar';
import { TaskBoard } from '@/components/taskboard/TaskBoard';
import { CreateEntryModal } from '@/components/modals/CreateEntryModal';
import { mockCurrentUser, mockActivities } from '@/data/mockActivities';
import { Activity, FilterState, User } from '@/types/activity';

export function MainLayout() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    selectedUsers: [],
    selectedSetores: [],
  });

  const allUsers: User[] = useMemo(() => {
    const seen = new Set<string>();
    return activities
      .map((a) => a.user)
      .filter((u) => {
        if (seen.has(u.id)) return false;
        seen.add(u.id);
        return true;
      });
  }, [activities]);

  const allSetores: string[] = useMemo(() => {
    return [...new Set(allUsers.map((u) => u.setor))].sort();
  }, [allUsers]);

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

      if (filters.selectedUsers.length > 0) {
        if (!filters.selectedUsers.includes(activity.user.id)) return false;
      }

      if (filters.selectedSetores.length > 0) {
        if (!filters.selectedSetores.includes(activity.user.setor)) return false;
      }

      return true;
    });
  }, [activities, filters]);

  const handleDelete = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-rema-cream overflow-hidden">
      <Sidebar user={mockCurrentUser} />

      <main className="flex-1 flex flex-col min-w-0">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          editMode={editMode}
          onToggleEditMode={() => setEditMode((prev) => !prev)}
          onCreateNew={() => setIsModalOpen(true)}
          allUsers={allUsers}
          allSetores={allSetores}
        />

        <TaskBoard
          activities={filteredActivities}
          editMode={editMode}
          onDelete={handleDelete}
          selectedSetores={filters.selectedSetores}
        />
      </main>

      <CreateEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
