# Sistema de Autenticação

## Visão Geral

Sistema simples de autenticação com **token fixo**. O administrador faz login com credenciais (username/password) e usa um token fixo armazenado no `.env` para acessar os endpoints protegidos.

## 🔐 Como Funciona

1. **Admin faz login** com username e password
2. **Servidor valida** as credenciais
3. **Frontend armazena o token fixo** (disponível em `.env` ou documentação do projeto)
4. **Frontend passa o token** em todos os requests para `/api/*`

---

## Endpoints de Autenticação

### 1. Login - `POST /auth/login`

Valida as credenciais do administrador.

**Request:**
```json
{
  "username": "admin",
  "password": "sua-senha-segura-aqui"
}
```

**Response (200) - Sucesso:**
```json
{
  "message": "Login com sucesso"
}
```

**Response (401) - Erro:**
```json
{
  "error": "Usuário ou senha inválidos"
}
```

---

### 2. Logout - `POST /auth/logout`

Confirma o logout (endpoint informativo).

**Response (200):**
```json
{
  "message": "Logout OK"
}
```

---

## 🔑 Token Fixo

O token é **fixo e permanente**, armazenado na variável `JWT_SECRET` do `.env`:

```
JWT_SECRET=038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4
```

**Não muda** após login - é o mesmo para todas as requisições.

---

## 📱 Como usar no Frontend

### 1. Fazer Login

```javascript
const response = await fetch('https://api.endoclin.cloud/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'sua-senha-segura-aqui'
  })
})

const data = await response.json()
// Resposta: { "message": "Login com sucesso" }
```

### 2. Usar o Token em Requisições Protegidas

Após login bem-sucedido, use o token fixo:

```javascript
const token = '038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4'

const response = await fetch('https://api.endoclin.cloud/api/profissionais', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 3. Armazenar o Token Localmente

```javascript
// Após login bem-sucedido
localStorage.setItem('token', '038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4')

// Em próximas requisições
const token = localStorage.getItem('token')
// Use conforme exemplo acima
```

---

## ✅ Credenciais Padrão

| Campo | Valor |
|-------|-------|
| **Username** | `admin` |
| **Password** | `sua-senha-segura-aqui` |
| **Token** | `038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4` |

---

## 🛡️ Segurança

- Token é **fixo e não expira**
- Senha é **hasheada com bcryptjs** no `.env`
- Endpoints `/api/*` requerem o token no header `Authorization`
- Se não passar o token ou for inválido, retorna **401 Unauthorized**
{
  "message": "Logout realizado com sucesso"
}
```

---

## Usando o Token

Após login, adicione o token no header de autorização para acessar os endpoints protegidos:

```bash
curl -H "Authorization: Bearer <token>" \
  https://api.endoclin.cloud/api/profissionais
```

**Formato do header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Configuração

### Variáveis de Ambiente Obrigatórias

```bash
# Credenciais do admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<hash-bcrypt>

# Chave JWT (fixo, não muda)
JWT_SECRET=038ac372d166686dcd1eff9ecea660208f30d1eafd1098944b05a9fdedfba9e4
```

### Gerar Hash de Senha

Para mudar a senha do admin, gere um novo hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('nova-senha-aqui', 10))"
```

---

## Fluxo de Autenticação (Frontend)

```javascript
// 1. Login
const loginResponse = await fetch('https://api.endoclin.cloud/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'sua-senha'
  })
})
const { token } = await loginResponse.json()

// 2. Guardar token (localStorage, sessionStorage ou memory)
localStorage.setItem('authToken', token)

// 3. Usar token para requisições
const response = await fetch('https://api.endoclin.cloud/api/profissionais', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// 4. Se receber 401, fazer logout
if (response.status === 401) {
  await fetch('https://api.endoclin.cloud/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  localStorage.removeItem('authToken')
}
```

---

## Segurança

✅ **Boas práticas implementadas:**
- Senhas hash com bcryptjs (bcrypt)
- JWT com assinatura criptográfica
- Sessions em memória (rastreáveis)
- Validação de token em todas as rotas `/api`
- Proteção contra CSRF

⚠️ **Recomendações para produção:**
- Usar HTTPS obrigatório
- Guardar JWT_SECRET em um vault seguro
- Usar Redis/DB para armazenar sessions (em vez de Set em memória)
- Implementar rate limiting em `/auth/login`
- Adicionar logs de auditoria
- Implementar timeout de sessão

