'use client';

import { FilterState, User } from '@/types/activity';
import { UserSetorFilter } from './UserSetorFilter';

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  editMode: boolean;
  onToggleEditMode: () => void;
  onCreateNew: () => void;
  allUsers: User[];
  allSetores: string[];
}

export function FilterBar({
  filters,
  onFiltersChange,
  editMode,
  onToggleEditMode,
  onCreateNew,
  allUsers,
  allSetores,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 flex-wrap">
        {/* Busca por texto */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar atividades..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent w-52"
          />
        </div>

        {/* Filtro de data */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap font-medium">De:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap font-medium">Até:</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange"
          />
        </div>

        {/* Filtro de usuários & setores */}
        <UserSetorFilter
          users={allUsers}
          setores={allSetores}
          selectedUsers={filters.selectedUsers}
          selectedSetores={filters.selectedSetores}
          onUsersChange={(ids) => onFiltersChange({ ...filters, selectedUsers: ids })}
          onSetoresChange={(setores) => onFiltersChange({ ...filters, selectedSetores: setores })}
        />
      </div>

      {/* Botões de ação */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            editMode
              ? 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {editMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            )}
          </svg>
          {editMode ? 'Cancelar' : 'Editar'}
        </button>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-rema-orange text-white rounded-lg text-sm font-medium hover:bg-rema-rust transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Atividade
        </button>
      </div>
    </div>
  );
}
