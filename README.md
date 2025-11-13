# sistema-estoque
# Sistema de Controle de Estoque

Sistema web completo para **gerenciar produtos, saldos e movimentos de estoque**, com autenticação de usuário e interface visual com alertas de estoque baixo.

Desenvolvido como projeto final de disciplina de **Programação Web com Node.js**.

---

## Funcionalidades

- Cadastro, edição e exclusão de produtos
- Controle de saldo atual com **status visual** (OK / Baixo)
- Registro de **entradas e saídas** com validação
- Autenticação de usuário (login/senha)
- Interface responsiva com cores de alerta
- Banco de dados relacional (PostgreSQL)

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|----------|--------|-----|
| **Node.js** | `v20+` | Backend |
| **Express** | `^4.21.1` | Framework web |
| **EJS** | `^3.1.10` | Template engine (HTML + JS) |
| **PostgreSQL** | `v14+` | Banco de dados |
| **pg** | `^8.13.1` | Driver PostgreSQL |
| **express-session** | `^1.18.1` | Sessão de login |
| **nodemon** | `^3.1.7` | Desenvolvimento (reload automático) |

---

## Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Matheus2570/sistema-estoque.git
cd sistema-estoque
npm install express ejs pg express-session
npm install --save-dev nodemon

