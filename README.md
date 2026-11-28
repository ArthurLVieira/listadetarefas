# Lista de Tarefas

Aplicação web em React, TypeScript e Vite para consumir a API de tarefas.

## Desenvolvimento local

Instale as dependências e inicie o servidor:

```sh
npm ci
npm run dev
```

O arquivo `.env` aponta para a API local em `http://localhost:8080`. Para usar
outra API sem alterar arquivos versionados, crie `.env.local`:

```dotenv
VITE_API_URL=http://localhost:8080/api
VITE_OAUTH2_URL=http://localhost:8080/oauth2/authorization/google
```

## Build e deploy

Configure as variáveis no provedor de hospedagem para apontar para a API de
produção:

- API: `https://apilistadetarefas.onrender.com/api`
- Login Google: `https://apilistadetarefas.onrender.com/oauth2/authorization/google`

Em uma hospedagem estática, use:

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **SPA fallback/rewrite:** encaminhe rotas não encontradas para `/index.html`

As variáveis podem ser sobrescritas na configuração do provedor:
`VITE_API_URL` deve incluir o prefixo `/api`; `VITE_OAUTH2_URL` deve apontar
para o endpoint de autorização OAuth2. Variáveis `VITE_*` são incluídas no
bundle do navegador e não devem conter segredos.

O servidor da API também precisa permitir a origem do frontend na configuração
de CORS e ter o callback OAuth do Google configurado para o domínio público da
API.

## Validação

```sh
npm run build
npm run lint
```
