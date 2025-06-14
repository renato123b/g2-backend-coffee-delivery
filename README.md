
# ☕ Coffee Delivery - Backend API

Este é o projeto do backend da aplicação **Coffee Delivery**, desenvolvido com **NestJS** e **Prisma ORM**, utilizando **PostgreSQL** como banco de dados.

> 💻 Projeto da disciplina **Desenvolvimento de Software para Web - G2 (2025)**.

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Class Validator](https://github.com/typestack/class-validator)

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd g2-backend-coffee-delivery
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

Crie um arquivo `.env` na raiz do projeto e insira:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/nome_do_banco?sslmode=require
```

4. Execute as migrations do Prisma:

```bash
npx prisma migrate dev --name init
```

5. Inicie o servidor:

```bash
npm run start:dev
```

---

## 📘 Endpoints

A API possui rotas para gerenciar:

- ✅ Cafés (`/coffees`)
  - `GET /coffees` → Lista todos
  - `GET /coffees/:id` → Detalhes por ID
  - `POST /coffees` → Cria novo café
  - `PATCH /coffees/:id` → Atualiza café
  - `DELETE /coffees/:id` → Remove café
  - `GET /coffees/search` → Busca com filtros (nome, data, tags, paginação)

- 🛒 Carrinho (`/cart`)
  - `POST /cart` → Cria carrinho
  - `GET /cart/:id` → Ver carrinho
  - `POST /cart/:id/items` → Adiciona item
  - `PATCH /cart/:id/items/:itemId` → Atualiza item
  - `DELETE /cart/:id/items/:itemId` → Remove item

- 📦 Checkout (`/checkout`)
  - `POST /checkout` → Finaliza pedido com carrinho

---

## 🧪 Testes

- Use ferramentas como **Insomnia** ou **Postman** para testar os endpoints.
- As validações são feitas com `class-validator`.

---

## 📁 Estrutura de Pastas

```bash
src/
├── coffees/
├── cart/
├── checkout/
├── prisma/
└── main.ts
```

---

## 🧠 Autor

Desenvolvido por Renatinho — 2025
