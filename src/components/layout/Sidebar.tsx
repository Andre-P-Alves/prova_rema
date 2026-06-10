export function Sidebar() {
  return (
    <aside className="w-64 bg-rema-dark border-r border-rema-dark-mid flex flex-col p-4 flex-shrink-0">
      <div className="mb-6">
        <h1 className="text-white font-bold text-xl tracking-tight">REMA</h1>
        <p className="text-rema-tan text-xs mt-0.5">Registro de Atividades</p>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-rema-dark-mid text-white text-sm font-medium">
          <svg className="w-4 h-4 text-rema-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Atividades
        </div>
      </nav>

      <div className="text-rema-tan/40 text-xs text-center border-t border-rema-dark-mid pt-4">
        v0.3.0
      </div>
    </aside>
  );
}
