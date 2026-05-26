# Front-end Next.js

Aplicação da loja em Next.js, consumindo a API NestJS do diretório `backend/`.

## Rodando localmente

```bash
npm install
npm run dev
```

App disponível em `http://localhost:3000`.

## API

Por padrão, o front usa `http://localhost:3001`. Para trocar, crie `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
