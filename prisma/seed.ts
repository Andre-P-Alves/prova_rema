import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const andre = await prisma.user.upsert({
    where: { email: 'andre.p.a.8.2001@gmail.com' },
    update: {},
    create: {
      id: 'user-1',
      name: 'André Alves',
      email: 'andre.p.a.8.2001@gmail.com',
      setor: 'Desenvolvimento',
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria.santos@example.com' },
    update: {},
    create: {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      setor: 'DevOps',
    },
  });

  const joao = await prisma.user.upsert({
    where: { email: 'joao.pereira@example.com' },
    update: {},
    create: {
      id: 'user-3',
      name: 'João Pereira',
      email: 'joao.pereira@example.com',
      setor: 'Desenvolvimento',
    },
  });

  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'task-1',
        startTime: new Date('2026-06-09T08:00:00'),
        endTime: new Date('2026-06-09T09:30:00'),
        description: 'Reunião de planejamento do sprint com a equipe de desenvolvimento.',
        userId: andre.id,
        createdAt: new Date('2026-06-09T07:55:00'),
      },
      {
        id: 'task-2',
        startTime: new Date('2026-06-09T10:00:00'),
        endTime: new Date('2026-06-09T11:00:00'),
        description: 'Revisão de código e aprovação de pull requests pendentes no repositório.',
        userId: andre.id,
        createdAt: new Date('2026-06-09T09:50:00'),
      },
      {
        id: 'task-3',
        startTime: new Date('2026-06-09T13:00:00'),
        endTime: null,
        description: 'Desenvolvimento de novos endpoints na API REST para integração com o cliente mobile.',
        userId: joao.id,
        createdAt: new Date('2026-06-09T12:50:00'),
      },
      {
        id: 'task-4',
        startTime: new Date('2026-06-09T16:00:00'),
        endTime: new Date('2026-06-09T17:00:00'),
        description: 'Testes de integração e correção de bugs reportados pela equipe de QA.',
        userId: andre.id,
        createdAt: new Date('2026-06-09T15:55:00'),
      },
      {
        id: 'task-5',
        startTime: new Date('2026-06-08T09:00:00'),
        endTime: new Date('2026-06-08T12:00:00'),
        description: 'Configuração do ambiente de deploy em produção e ajuste de variáveis de ambiente.',
        userId: maria.id,
        createdAt: new Date('2026-06-08T08:45:00'),
      },
      {
        id: 'task-6',
        startTime: new Date('2026-06-10T09:00:00'),
        endTime: null,
        description: 'Monitoramento dos pipelines de CI/CD após atualização dos runners.',
        userId: maria.id,
        createdAt: new Date('2026-06-10T08:55:00'),
      },
      {
        id: 'task-7',
        startTime: new Date('2026-06-08T14:00:00'),
        endTime: new Date('2026-06-08T15:45:00'),
        description: 'Documentação dos endpoints da API e atualização do README do projeto.',
        userId: joao.id,
        createdAt: new Date('2026-06-08T13:55:00'),
      },
      {
        id: 'task-8',
        startTime: new Date('2026-06-05T14:00:00'),
        endTime: new Date('2026-06-08T15:45:00'),
        description: 'Atualização dos endpoints da API e atualização do README do projeto.',
        userId: joao.id,
        createdAt: new Date('2026-06-05T13:55:00'),
      },
    ],
  });

  console.log('Seed concluído:', { andre, maria, joao });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
