# Desafio E-Commerce (Vite + Node.js)

Projeto full stack com:

- Front-end: React + Vite + TypeScript
- Back-end: Node.js + Express + TypeORM + SQLite (relacional)
- Extras aplicados: React Hook Form, TanStack Query, Zod

## Estrutura

- `frontend/` -> interface da loja e carrinho
- `backend/` -> API RESTful do carrinho e checkout

## Funcionalidades implementadas

### Front-end

- Lista de produtos com nome, descrição e imagem ilustrativa
- Adicionar produto ao carrinho
- Visualizar carrinho com:
  - nome
  - quantidade
  - subtotal por item
- Atualizar quantidade de item
- Remover item individualmente
- Exibir total da compra
- Finalizar compra (envio para API)

### Back-end

- `GET /produtos` -> lista produtos
- `GET /carrinho` -> retorna estado atual do carrinho
- `POST /carrinho` -> adiciona produto no carrinho
- `PUT /carrinho` -> atualiza quantidade ou remove item (quantidade 0)
- `POST /finalizar-compra` -> registra venda no banco relacional e gera e-mail de confirmação

## Requisitos

- Node.js 20+
- npm 10+

## Como rodar localmente

### 1) Subir backend

```bash
cd backend
npm install
npm run dev
```

API disponivel em `http://localhost:3001`.

Observações:

- Banco relacional SQLite em `backend/database.sqlite`
- Produtos são semeados automaticamente no primeiro start
- E-mail de confirmação é gerado com `jsonTransport` do Nodemailer e exibido no log do backend

### 2) Subir frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

App disponivel em `http://localhost:5173`.

## Variaveis de ambiente (frontend)

Opcionalmente, você pode criar `frontend/.env` para trocar a URL da API:

```env
VITE_API_URL=http://localhost:3001
```

## Seguranca aplicada no backend

- `helmet` para headers de segurança
- `cors` restrito ao frontend local
- `express-rate-limit` para limitar abuso
- Validação de payload com `zod`
- JSON body limitado em tamanho

## Build de producao

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
npm run start
```
