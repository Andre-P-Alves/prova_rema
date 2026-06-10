import { Activity, User } from '@/types/activity';

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'André Alves',
  email: 'andre.p.a.8.2001@gmail.com',
  setor: 'Desenvolvimento',
};

const userMaria: User = {
  id: 'user-2',
  name: 'Maria Santos',
  email: 'maria.santos@example.com',
  setor: 'DevOps',
};

const userJoao: User = {
  id: 'user-3',
  name: 'João Pereira',
  email: 'joao.pereira@example.com',
  setor: 'Desenvolvimento',
};

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    startTime: new Date('2026-06-09T08:00:00'),
    endTime: new Date('2026-06-09T09:30:00'),
    description: 'Reunião de planejamento do sprint com a equipe de desenvolvimento.',
    user: mockCurrentUser,
    createdAt: new Date('2026-06-09T07:55:00'),
  },
  {
    id: 'act-2',
    startTime: new Date('2026-06-09T10:00:00'),
    endTime: new Date('2026-06-09T11:00:00'),
    description: 'Revisão de código e aprovação de pull requests pendentes no repositório.',
    user: mockCurrentUser,
    createdAt: new Date('2026-06-09T09:50:00'),
  },
  {
    id: 'act-3',
    startTime: new Date('2026-06-09T13:00:00'),
    endTime: new Date('2026-06-09T15:30:00'),
    description: 'Desenvolvimento de novos endpoints na API REST para integração com o cliente mobile.',
    user: userJoao,
    createdAt: new Date('2026-06-09T12:50:00'),
  },
  {
    id: 'act-4',
    startTime: new Date('2026-06-09T16:00:00'),
    endTime: new Date('2026-06-09T17:00:00'),
    description: 'Testes de integração e correção de bugs reportados pela equipe de QA.',
    user: mockCurrentUser,
    createdAt: new Date('2026-06-09T15:55:00'),
  },
  {
    id: 'act-5',
    startTime: new Date('2026-06-08T09:00:00'),
    endTime: new Date('2026-06-08T12:00:00'),
    description: 'Configuração do ambiente de deploy em produção e ajuste de variáveis de ambiente.',
    user: userMaria,
    createdAt: new Date('2026-06-08T08:45:00'),
  },
  {
    id: 'act-6',
    startTime: new Date('2026-06-08T14:00:00'),
    endTime: new Date('2026-06-08T15:45:00'),
    description: 'Documentação dos endpoints da API e atualização do README do projeto.',
    user: userJoao,
    createdAt: new Date('2026-06-08T13:55:00'),
  },
];
