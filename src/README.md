# Backend SoftClin Agenda

Backend Node.js/Express para gerenciar a API de profissionais e agendamentos com PostgreSQL.

## 🚀 Quick Start

**URL Base:** `https://api.endoclin.cloud`

### 1. Fazer Login

```bash
curl -X POST https://api.endoclin.cloud/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"sua-senha-segura-aqui"}'
```

**Response:** `{"message":"Login com sucesso"}`

### 2. Usar o Token Fixo

Token: `038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4`

```bash
curl -X GET https://api.endoclin.cloud/api/profissionais \
  -H "Authorization: Bearer 038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4"
```

---

## 📚 Endpoints

### Health Check (sem autenticação)
- `GET /` - Status do servidor
- `GET /health` - Health check

### Autenticação
- `POST /auth/login` - Login (username + password)
- `POST /auth/logout` - Logout informativo

### Profissionais (requerem token)
- `GET /api/profissionais` - Listar todos
- `POST /api/profissionais` - Criar novo
- `PATCH /api/profissionais?filter[id]=1` - Atualizar
- `DELETE /api/profissionais?filter[id]=1` - Deletar

### Agendamentos (requerem token)
- `GET /api/agendamentos` - Listar todos
- `POST /api/agendamentos` - Criar novo
- `PATCH /api/agendamentos?filter[id]=1` - Atualizar
- `DELETE /api/agendamentos?filter[id]=1` - Deletar

---

## 🔐 Autenticação

Veja [AUTH.md](./AUTH.md) para detalhes completos.

**Token fixo (sempre o mesmo):**
```
Authorization: Bearer 038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4
```

---

## 📝 Exemplos de Requisições

### Criar Profissional

```bash
curl -X POST https://api.endoclin.cloud/api/profissionais \
  -H "Authorization: Bearer 038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "Dr. João Silva",
    "nome_exibicao": "Dr. João",
    "especialidade": "Cardiologia",
    "crm_registro": "123456/SP",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "ativo": true
  }'
```

### Criar Agendamento

```bash
curl -X POST https://api.endoclin.cloud/api/agendamentos \
  -H "Authorization: Bearer 038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_paciente": "Maria Santos",
    "profissional": "Dr. João",
    "data_consulta": "2024-12-15",
    "hora_consulta": "14:00",
    "tipo_consulta": "presencial",
    "status": "pendente",
    "primeira_consulta": true
  }'
```

### Atualizar Profissional

```bash
curl -X PATCH "https://api.endoclin.cloud/api/profissionais?filter[id]=1" \
  -H "Authorization: Bearer 038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "11988888888"
  }'
```

---

## 💾 Banco de Dados

PostgreSQL em `coolify.endoclin.cloud:5433`

**Tabelas:**
- `profissionais` - Dados dos profissionais de saúde
- `agendamentos` - Agendamentos de consultas

---

## 📋 Requisitos para Desenvolvimento Local

- Node.js 20+
- PostgreSQL 12+
- npm

### Instalação Local

```bash
# 1. Clonar e instalar
git clone https://github.com/dbechelli/endoclin-backend.git
cd endoclin-backend
npm install

# 2. Configurar .env
cp .env.example .env
# Edite com suas credenciais

# 3. Rodar localmente
npm start
# ou npm run dev (com nodemon)
```

---

## 🐳 Docker

Já configurado para Coolify. Build automático no push.
```bash
npm start
```

## 📡 Endpoints

### Health Check (sem autenticação)
- `GET /health` - Verifica se o servidor está rodando

### Profissionais
- `GET /api/profissionais` - Listar todos
- `GET /api/profissionais?filter[ativo]=true` - Listar apenas ativos
- `GET /api/profissionais?orderBy=nome_exibicao` - Ordenar por nome
- `POST /api/profissionais` - Criar novo
- `PATCH /api/profissionais?filter[id]=1` - Atualizar
- `DELETE /api/profissionais?filter[id]=1` - Deletar

### Agendamentos
- `GET /api/agendamentos` - Listar todos
- `GET /api/agendamentos?orderBy=data_consulta` - Ordenar por data
- `POST /api/agendamentos` - Criar novo

## 🔐 Autenticação

Todos os endpoints `/api/*` requerem um Bearer Token no header:
```
Authorization: Bearer sua_chave_api_secreta
```

## 🧪 Testando com Postman

1. Importe a coleção: `SoftClin-Agenda-API.postman_collection.json`
2. Configure a variável `API_URL` para `http://localhost:3001/api`
3. Configure a variável `API_KEY` com o valor do `.env`
4. Teste os endpoints!

## 📁 Estrutura do Projeto

```
backend/
├── server.js           # Arquivo principal
├── package.json        # Dependências
├── .env               # Variáveis de ambiente (não comitar)
├── .env.example       # Exemplo de .env
└── README.md          # Este arquivo
```

## 🐛 Debug

O servidor exibe as variáveis carregadas ao iniciar:
```
📋 Variáveis de Ambiente Carregadas:
PORT: 3001
DB_USER: postgres
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: softclin_agenda
API_KEY: ✓ Definida
```

Se houver problemas, verifique se o arquivo `.env` está no diretório raiz do backend.

## 📝 Notas

- O endpoint `/debug/env` mostra as variáveis (remova em produção!)
- Os dados de `config_atendimento` são armazenados como JSON
- Implementar validações adicionais conforme necessário
- Considere adicionar autenticação de usuário

## 📞 Suporte

Para problemas com conexão PostgreSQL, verifique:
- Credenciais no `.env`
- Se o PostgreSQL está rodando
- Firewall e conectividade de rede
