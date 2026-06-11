# REMA — Registro de Atividades

Aplicação de registro de atividades com histórico, filtragem e análise. Permite cadastrar atividades com horário de início, término e descrição, organizadas por usuário e setor, com controle de status e consolidado de tempo registrado.

## Stack

| Camada         | Tecnologia                      |
| -------------- | ------------------------------- |
| Framework      | Next.js 15 (App Router)         |
| Linguagem      | TypeScript                      |
| Estilos        | Tailwind CSS                    |
| ORM            | Prisma                          |
| API interna    | tRPC v11 (type-safe, frontend)  |
| API externa    | REST (Route Handlers Next.js)   |
| Autenticação   | NextAuth v5 (credentials + JWT) |
| Banco de dados | PostgreSQL                      |

> **Decisão de arquitetura:** o frontend consome tRPC para obter segurança de tipos end-to-end sem serialização manual. Os endpoints REST (`/api/tasks/*`) existem em paralelo para consumo externo e conformidade com o padrão REST, reutilizando as mesmas queries Prisma.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- [PostgreSQL](https://www.postgresql.org/) rodando localmente ou em nuvem

---

## Setup

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd teste_REMA
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/rema_db"

# Gere com: openssl rand -base64 32
AUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Execute as migrations

```bash
npm run db:migrate
```

> Para desenvolvimento sem gerar arquivos de migration, use `npm run db:push`.

### 5. Popule o banco com dados iniciais

```bash
npm run db:seed
```

Cria 3 usuários com senhas pré-definidas e 8 atividades de exemplo.

### 6. Inicie o servidor

```bash
npm run dev
```

Acesse **http://localhost:3000** no navegador. Você será redirecionado para a tela de login.

---

## Autenticação

O acesso à aplicação requer login. As credenciais dos usuários criados pelo seed são:

| Usuário       | E-mail                          | Senha      | Role  |
| ------------- | ------------------------------- | ---------- | ----- |
| André Alves   | andre.p.a.8.2001@gmail.com      | admin123   | ADMIN |
| Maria Santos  | maria.santos@example.com        | user123    | USER  |
| João Pereira  | joao.pereira@example.com        | user123    | USER  |