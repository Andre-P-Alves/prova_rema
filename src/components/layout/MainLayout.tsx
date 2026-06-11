// Layout principal da dashboard — centraliza o estado de filtros, modais e modo de edição.
'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { FilterBar } from '@/components/taskboard/FilterBar';
import { TaskBoard } from '@/components/taskboard/TaskBoard';
import { CreateEntryModal } from '@/components/modals/CreateEntryModal';
import { EditEntryModal } from '@/components/modals/EditEntryModal';
import { trpc } from '@/lib/trpc/client';
import { Activity, FilterState } from '@/types/activity';

export function MainLayout() {
  const [editMode, setEditMode] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Activity | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    selectedUsers: [],
    selectedSetores: [],
    status: 'all',
  });

  const { data: tasks = [] } = trpc.task.getAll.useQuery();
  const { data: users = [] } = trpc.user.getAll.useQuery();

  const utils = trpc.useUtils();
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.invalidate(),
  });

  const allSetores = useMemo(() => {
    return [...new Set(users.map((u) => u.setor))].sort();
  }, [users]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesUser = task.user.name.toLowerCase().includes(q);
        if (!matchesDesc && !matchesUser) return false;
      }

      if (filters.startDate) {
        const startFilter = new Date(filters.startDate + 'T00:00:00');
        if (task.startTime < startFilter) return false;
      }

      if (filters.endDate) {
        const endFilter = new Date(filters.endDate + 'T23:59:59');
        if (task.startTime > endFilter) return false;
      }

      if (filters.selectedUsers.length > 0) {
        if (!filters.selectedUsers.includes(task.user.id)) return false;
      }

      if (filters.selectedSetores.length > 0) {
        if (!filters.selectedSetores.includes(task.user.setor)) return false;
      }

      if (filters.status === 'in_progress' && task.status !== 'IN_PROGRESS') return false;
      if (filters.status === 'completed' && task.status !== 'COMPLETED') return false;

      return true;
    });
  }, [tasks, filters]);

  return (
    <div className="flex h-screen bg-rema-cream overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          editMode={editMode}
          onToggleEditMode={() => setEditMode((prev) => !prev)}
          onCreateNew={() => setIsCreateOpen(true)}
          allUsers={users}
          allSetores={allSetores}
        />

        <TaskBoard
          activities={filteredTasks}
          editMode={editMode}
          onDelete={(id) => deleteTask.mutate({ id })}
          onEdit={(activity) => setEditingTask(activity)}
          selectedSetores={filters.selectedSetores}
        />
      </main>

      <CreateEntryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditEntryModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
