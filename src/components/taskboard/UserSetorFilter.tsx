'use client';
// Botão para filtro de usuários e setores. 
import { useState, useRef, useEffect } from 'react';
import { User } from '@/types/activity';

interface UserSetorFilterProps {
  users: User[];
  setores: string[];
  selectedUsers: string[];
  selectedSetores: string[];
  onUsersChange: (ids: string[]) => void;
  onSetoresChange: (setores: string[]) => void;
  onClearAll: () => void;
}

export function UserSetorFilter({
  users,
  setores,
  selectedUsers,
  selectedSetores,
  onUsersChange,
  onSetoresChange,
  onClearAll,
}: UserSetorFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = <T,>(list: T[], item: T, setter: (next: T[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const activeCount = selectedUsers.length + selectedSetores.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all ${
          activeCount > 0
            ? 'bg-rema-orange text-white border-rema-orange'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Usuários &amp; Setores
        {activeCount > 0 && (
          <span className="bg-white/30 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-30 bg-white rounded-xl shadow-xl border border-gray-200 w-80">
          <div className="flex divide-x divide-gray-100">
            {/* Setores */}
            <div className="w-2/5 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Setores
              </p>
              <div className="space-y-1">
                {setores.map((setor) => (
                  <label
                    key={setor}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-rema-cream cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSetores.includes(setor)}
                      onChange={() => toggle(selectedSetores, setor, onSetoresChange)}
                      className="w-4 h-4 rounded border-gray-300 accent-rema-orange"
                    />
                    <span className="text-sm text-gray-700 truncate">{setor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Usuários */}
            <div className="flex-1 p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Usuários
              </p>
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent"
              />
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-rema-cream cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggle(selectedUsers, user.id, onUsersChange)}
                      className="w-4 h-4 rounded border-gray-300 accent-rema-orange flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-700 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.setor}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="border-t border-gray-100 px-3 py-2 flex justify-end">
              <button
                onClick={onClearAll}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
