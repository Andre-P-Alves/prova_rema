// Funções de formatação de data e duração em pt-BR usadas nos cards de atividade.
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getDuration(startTime: Date, endTime?: Date | null): string {
  const end = endTime ?? new Date();
  const diff = end.getTime() - startTime.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    if (hours > 0 && minutes > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${days}d ${hours}h`;
    if (minutes > 0) return `${days}d ${minutes}m`;
    return `${days}d`;
  }
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
