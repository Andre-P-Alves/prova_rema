'use client';

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEntryModal({ isOpen, onClose }: CreateEntryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-rema-dark/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Nova Atividade</h2>
            <p className="text-xs text-gray-400 mt-0.5">Preencha os dados da atividade</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-rema-cream transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              placeholder="Descreva a atividade realizada..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Término</label>
              <span className="text-xs text-gray-400">Opcional — deixe vazio para &quot;em andamento&quot;</span>
            </div>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rema-orange focus:border-transparent"
            />
          </div>

          {/* Preview do estado */}
          <div className="flex items-center gap-2 bg-rema-cream rounded-lg px-3 py-2.5">
            <span className="w-2 h-2 rounded-full bg-rema-orange animate-pulse flex-shrink-0" />
            <p className="text-xs text-rema-rust">
              Sem término preenchido, a atividade ficará como <span className="font-semibold">Em andamento</span>.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-rema-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-rema-orange text-white rounded-lg text-sm font-medium hover:bg-rema-rust transition-colors shadow-sm"
            >
              Criar Atividade
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-300 text-center mt-4">
          Dependencia back end
        </p>
      </div>
    </div>
  );
}
