# Projeto Frontend Next.js – CRUD de Usuários

## Introdução ao Projeto

Este projeto é a interface frontend de um sistema de gerenciamento de usuários (CRUD de Usuários), desenvolvido com Next.js, React, TypeScript e React Query. Ele se comunica com uma API NestJS via HTTP e utiliza Docker para facilitar o ambiente de execução.

---

## Tecnologias Utilizadas

- **Next.js** – Framework React para SSR e SPA.
- **React Query** – Gerenciamento de cache e estado remoto.
- **Axios** – Requisições HTTP.
- **SCSS Modules** – Estilização escopada por componente.
- **Jest + Testing Library** – Testes unitários e de integração.
- **Docker** – Ambiente isolado de desenvolvimento e execução.

---

## Estrutura de Pastas

```
📁 src
├── components         # Componentes reutilizáveis como tabela e paginação
├── hooks              # Hooks customizados com React Query
├── pages              # Estrutura de rotas do Next.js
├── providers          # Configuração do axios e auth
├── styles             # Estilos globais e variáveis
├── tests              # Testes unitários e integração
└── utils              # Funções auxiliares (ex: serialização de query)
```

---

## Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Backend NestJS (ver documentação do backend para instruções)

### Passos

1. **Clone o projeto:**

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` com a URL da API:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Suba os containers com Docker Compose:**

```bash
docker-compose up --build
```

4. **Acesse o frontend:**

Abra seu navegador e vá até:

```
http://localhost:3001
```

---

## Decisões Técnicas

### React Query

Optamos por React Query por sua robustez no controle de cache, revalidação e sincronização com o servidor.

### SCSS Modules

O uso de módulos SCSS garante encapsulamento de estilos e manutenção simplificada por componente.

## Testes

Para rodar os testes:

```bash
pnpm install
pnpm run test
```

### Estrutura baseada em domínio

A separação entre `hooks`, `components`, `providers` e `utils` visa facilitar a escalabilidade e leitura do projeto.

### Docker

Todo o ambiente roda isolado via Docker. Isso elimina variações entre sistemas operacionais e garante que todos desenvolvedores e CI/CD tenham o mesmo ambiente.