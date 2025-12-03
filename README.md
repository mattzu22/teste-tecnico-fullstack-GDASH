# Sistema de Monitoramento Climático

Este é um sistema de monitoramento climático full-stack construído com uma arquitetura de microsserviços. Ele coleta dados de temperatura de uma API externa, os processa de forma assíncrona, armazena e expõe através de uma API segura com autenticação.

## ✨ Funcionalidades Principais

- **Coleta de Dados Periódica:** Um serviço em **Python** (`collector-service`) busca dados climáticos de múltiplas cidades em um intervalo de tempo definido.
- **Processamento Assíncrono com Fila:** Os dados coletados são enviados para uma fila **RabbitMQ**, garantindo que nenhum dado seja perdido.
- **Consumidor Robusto:** Um worker em **Go** (`worker`) consome os dados da fila, processa-os e os envia para a API principal.
- **API REST Completa:** Uma API em **NestJS** (`back-nest`) com CRUD de usuários, autenticação JWT e endpoints para visualização e exportação de dados climáticos.
- **Armazenamento:** Os dados de usuários e de clima são persistidos em um banco de dados **MongoDB**.
- **Containerização:** Todos os serviços são orquestrados e gerenciados com **Docker** e **Docker Compose**.

## 🏗️ Arquitetura

O fluxo de dados do sistema é o seguinte:

```
┌───────────────────┐      ┌────────────────┐      ┌────────────────┐
│    API Externa    │─────▶│    Serviço     │─────▶│    RabbitMQ    │
│   (Open-Meteo)    │      │ Coletor (Python) │      │      (Fila)      │
└───────────────────┘      └────────────────┘      └────────────────┘
                                                           │
                                                           ▼
                                                   ┌───────────────┐
                                                   │  Worker (Go)  │
                                                   │ (Processador) │
                                                   └───────────────┘
                                                           │
                                                           ▼
┌───────────────────┐      ┌────────────────┐      ┌────────────────┐
│ Frontend (React)  │◀─────│  API (NestJS)  │◀─────│    MongoDB     │
│     (Painel)      │      │                │      │ (Banco de Dados) │
└───────────────────┘      └────────────────┘      └────────────────┘
```

-   **`collector-service` (Python):** Faz requisições periódicas à API [Open-Meteo](https://open-meteo.com/) para obter dados climáticos. Os dados coletados são publicados na fila do RabbitMQ.
-   **`worker` (Go):** Consome as mensagens da fila, formata os dados e os envia para o endpoint `/api/weather/logs` da API NestJS.
-   **`back-nest` (NestJS):** A API principal. Gerencia usuários, autenticação e os dados climáticos.
-   **`rabbitmq`:** O message broker, responsável pela comunicação assíncrona.
-   **`mongoDB`:** O banco de dados NoSQL para persistência dos dados.

## ⚙️ Como Executar o Projeto

Para executar o projeto localmente, siga estas etapas:

### Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Instalação

1.  Clone o repositório para a sua máquina local.
2.  Navegue até a raiz do projeto.
3.  Crie um arquivo de ambiente a partir do exemplo:
    ```sh
    cp .env.example .env
    ```
4.  **(Opcional)** Altere as variáveis no arquivo `.env` se necessário.
5.  Execute todos os serviços com o Docker Compose:
    ```sh
    docker-compose up -d --build
    ```
6.  Os serviços estarão disponíveis em seus respectivos ports. A API principal estará em `http://localhost:5443`.

## 🔐 Autenticação

A API utiliza **JSON Web Tokens (JWT)** para autenticação. A maioria dos endpoints requer um token de acesso, que deve ser enviado no cabeçalho `Authorization` como um `Bearer Token`.

### Usuário Padrão (Seed)

Ao iniciar a aplicação, um usuário administrador é criado automaticamente para facilitar os testes.

-   **E-mail:** `admin@example.com`
-   **Senha:** `Admin@123`

Utilize essas credenciais no endpoint `POST /api/auth/login` para obter um token de acesso.

## 📡 Endpoints da API (`back-nest`)

A API principal está disponível em `http://localhost:5443`.

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Realiza o login e retorna um token JWT. | N/A |

### Gerenciamento de Usuários

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Cria um novo usuário. | N/A |
| `GET` | `/api/users` | Lista todos os usuários. | **Requerida** |
| `GET` | `/api/users/:id` | Busca um usuário por ID. | **Requerida** |
| `PATCH` | `/api/users/:id` | Atualiza os dados de um usuário. | **Requerida** |
| `DELETE`| `/api/users/:id` | Deleta um usuário. | **Requerida** |

### Dados Climáticos

| Método | Endpoint | Descrição | Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/weather/logs` | Cria um novo registro climático (usado pelo `worker`). | N/A |
| `GET` | `/api/weather/logs` | Lista todos os registros climáticos. | **Requerida** |
| `GET` | `/api/weather/export/csv` | Exporta todos os dados climáticos em formato CSV. | **Requerida** |
| `GET` | `/api/weather/export/xlsx`| Exporta todos os dados climáticos em formato XLSX. | **Requerida** |

## 🔧 Variáveis de Ambiente

O arquivo `.env` configura todos os serviços. As variáveis mais importantes estão listadas abaixo:

| Variável | Serviço(s) | Descrição | Padrão |
| :--- | :--- | :--- | :--- |
| `RABBITMQ_USER` | Todos | Usuário de acesso ao RabbitMQ. | `mattzu` |
| `RABBITMQ_PASS` | Todos | Senha de acesso ao RabbitMQ. | `mattzu123` |
| `MONGO_USERNAME`| `mongoDB`, `back-nest` | Usuário do MongoDB. | `mattzu` |
| `MONGO_PASSWORD`| `mongoDB`, `back-nest` | Senha do MongoDB. | `mattzu123` |
| `PORT` | `back-nest` | Porta da API NestJS. | `5443` |
| `JWT_SECRET` | `back-nest` | Segredo para assinatura dos tokens JWT. | `your-secret-key` |
| `JWT_EXPIRES_IN`| `back-nest` | Tempo de expiração do token JWT. | `1d` |
| `LATITUDE` | `collector-service` | Latitude para a coleta de dados. | `5.783` |
| `LONGITUDE` | `collector-service` | Longitude para a coleta de dados. | `-35.200` |
| ... | ... | ... | ... |

*(Para uma lista completa, consulte o arquivo `.env.example`)*

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.