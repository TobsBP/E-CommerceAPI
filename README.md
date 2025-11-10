```markdown
# 🛒 E-Commerce API

Backend em **Fastify + TypeScript**, projetado para um sistema de **e-commerce moderno**.  
Inclui validação de dados com **Zod**, documentação automática com **Swagger**, e um ambiente de desenvolvimento rápido usando **TSX** e **Biome**.

---

## ⚙️ Tecnologias

- **Fastify** — Framework web rápido e leve para Node.js  
- **Zod** — Validação e tipagem de dados  
- **Swagger / Scalar** — Documentação automática da API  
- **Biome** — Formatação e linting  
- **TSX** — Execução rápida de TypeScript em modo watch  

---

## 🧱 Estrutura do Projeto

```

src/
├── server.ts               # Ponto de entrada do servidor
├── routes/                 # Definições das rotas
│    ├── products.ts        # Rotas de produtos
│    ├── users.ts           # Rotas de usuários
│    ├── orders.ts          # Rotas de pedidos
│    └── auth.ts            # Autenticação e login
├── controllers/            # Lógica das rotas
├── schemas/                # Schemas Zod para validação
├── services/               # Regras de negócio
├── config/                 # Conexão com banco, CORS, etc.
└── utils/                  # Funções auxiliares
.env                         # Variáveis de ambiente

````

---

## 🧩 Scripts

| Comando | Descrição |
|----------|------------|
| `npm run dev` | Executa o servidor em modo desenvolvimento |
| `npm run start` | Executa o servidor compilado (`dist/server.js`) |
| `npm run format` | Formata o código com o Biome |

---

## 🚀 Como Rodar

1. **Instalar dependências**
   ```bash
   npm install
````

2. **Rodar em desenvolvimento**

   ```bash
   npm run dev
   ```

3. **Acessar documentação Swagger**

   ```
   http://localhost:3333/docs
   ```

---

## 📦 Funcionalidades

* 🔐 Autenticação com JWT
* 👤 Gerenciamento de usuários
* 🛍️ CRUD de produtos
* 🧾 Criação e listagem de pedidos
* 💳 Integração futura com gateway de pagamento
* 📄 Documentação interativa com Swagger

---

## 🧪 Boas práticas

* **Zod** garante validação de todas as entradas.
* **Biome** mantém o código limpo e padronizado.
* Estrutura modular para facilitar manutenção e escalabilidade.

---

## 🏗️ Build e Deploy

Compilar o TypeScript antes do deploy:

```bash
npx tsc
npm start
```

---