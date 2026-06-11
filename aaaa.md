- A sessão é mantida via **JWT** (sem tabela de sessão no banco).
- Rotas `/` e `/metricas` são protegidas pelo middleware — qualquer acesso sem sessão redireciona para `/login`.
- Todos os endpoints tRPC exigem autenticação (`protectedProcedure`); chamadas sem sessão recebem `UNAUTHORIZED`.
- As roles `ADMIN` e `USER` estão disponíveis na sessão (`session.user.role`), mas não aplicam restrições funcionais por ora.

---

## API REST

Todos os endpoints retornam e aceitam JSON.

### Tarefas

| Método   | Endpoint               | Descrição                        |
| -------- | ---------------------- | -------------------------------- |
| `GET`    | `/api/tasks`           | Lista todas as tarefas           |
| `POST`   | `/api/tasks`           | Cria uma nova tarefa             |
| `GET`    | `/api/tasks/:id`       | Retorna uma tarefa pelo ID       |
| `PUT`    | `/api/tasks/:id`       | Atualiza campos de uma tarefa    |
| `DELETE` | `/api/tasks/:id`       | Remove uma tarefa                |
| `GET`    | `/api/tasks/summary`   | Retorna o consolidado de tempo   |

#### Corpo do `POST /api/tasks`

```json
{
  "description": "Reunião de planejamento",
  "startTime": "2026-06-10T09:00:00.000Z",
  "endTime": "2026-06-10T10:30:00.000Z",
  "userId": "user-1"
}
```

`endTime` é opcional — omiti-lo define o status como `IN_PROGRESS` automaticamente.

#### Resposta do `GET /api/tasks/summary`

```json
{
  "total": 8,
  "byStatus": {
    "completed": 6,
    "inProgress": 2,
    "cancelled": 0
  },
  "totalRegisteredTimeMs": 27000000,
  "totalRegisteredTime": "7h 30m",
  "avgTimePerTaskMs": 4500000,
  "avgTimePerTask": "1h 15m"
}
```

---

## Scripts disponíveis

| Comando              | Descrição                                                |
| -------------------- | -------------------------------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento                     |
| `npm run build`      | Gera o build de produção                                 |
| `npm run start`      | Inicia o servidor em modo produção                       |
| `npm run lint`       | Executa o ESLint                                         |
| `npm run db:migrate` | Cria e aplica uma nova migration                         |
| `npm run db:push`    | Aplica o schema ao banco sem gerar arquivos de migration |
| `npm run db:seed`    | Popula o banco com dados iniciais                        |
| `npm run db:studio`  | Abre o Prisma Studio (GUI do banco)                      |
| `npm run db:generate`| Regenera o Prisma Client                                 |

---

## Estrutura do projeto

```
prisma/
  schema.prisma          # Modelos User (com role e password) e Task
  seed.ts                # Dados iniciais (3 usuários com bcrypt, 8 tarefas)

src/
  auth.ts                # Configuração do NextAuth v5 (credentials + JWT)
  middleware.ts          # Proteção de rotas — redireciona para /login sem sessão

  app/
    api/
      auth/[...nextauth]/# Handlers GET/POST do NextAuth
      trpc/[trpc]/       # Handler HTTP do tRPC (uso interno)
      tasks/
        route.ts         # GET /api/tasks, POST /api/tasks
        [id]/route.ts    # GET · PUT · DELETE /api/tasks/:id
        summary/route.ts # GET /api/tasks/summary (consolidado)
    login/page.tsx       # Página de login com as cores do REMA
    metricas/page.tsx    # Página de métricas e gráficos
    layout.tsx           # Root layout com SessionProvider e TRPCProvider
    page.tsx             # Página principal de atividades

  components/
    layout/              # MainLayout, Sidebar (com logout), UserInfo
    taskboard/           # FilterBar, TaskBoard, TaskCard, UserSetorFilter
    modals/              # CreateEntryModal, EditEntryModal
    metrics/             # MetricsLayout, TasksBySetorChart,
                         # CompletedOverTimeChart

  lib/
    trpc/                # Client e Provider do tRPC
    utils.ts             # Formatação de datas e duração
    metricsUtils.ts      # Agregação de dados e utilitários de período

  server/
    db.ts                # Singleton do PrismaClient
    trpc.ts              # Init do tRPC: publicProcedure e protectedProcedure
    routers/
      _app.ts            # Router raiz
      user.ts            # CRUD de usuários (protegido)
      task.ts            # CRUD de tarefas (protegido)

  types/
    activity.ts          # Interfaces TypeScript (User, Activity, FilterState)
    next-auth.d.ts       # Augmentação dos tipos do NextAuth (id, role, setor)
```

---

## Funcionalidades

- **Autenticação** com credenciais (e-mail + senha), sessão JWT, proteção de rotas e logout
- **Registro de atividades** com início, término (opcional) e descrição
- **Status explícito**: `Em andamento`, `Concluída`, `Cancelada`
- **Filtros**: por data, texto, usuário, setor e status
- **Modo edição**: alterar responsável, status e horário de conclusão; excluir
- **Consolidado de tempo**: total registrado, média por tarefa, contagem por status
- **Métricas visuais**: gráfico de barras empilhadas por setor e gráfico de linhas de conclusões ao longo do tempo (semanal / mensal / anual)

---

## Roadmap

- [x] Protótipo visual (front-end com dados mock)
- [x] Schema Prisma + migrations versionadas
- [x] API tRPC com CRUD completo de tarefas e usuários
- [x] API REST paralela (`/api/tasks`)
- [x] Seed com dados de exemplo
- [x] Integração frontend ↔ backend
- [x] Consolidado de tempo registrado
- [x] Página de métricas com gráficos
- [x] Autenticação (NextAuth v5, credentials, JWT, proteção de rotas)
