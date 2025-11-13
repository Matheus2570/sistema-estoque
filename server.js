const express = require('express');
const { Client } = require('pg');
const session = require('express-session');
const app = express();
const PORT = 3000;

// --- Conexão PostgreSQL ---
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'EquipamentosInformatica',
  password: 'senai',
  port: 5432,
});

client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL'))
  .catch(err => console.error('❌ Erro de conexão', err.stack));

// --- Configuração geral ---
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'chave_super_secreta',
  resave: false,
  saveUninitialized: false,
}));

// --- Middleware de autenticação ---
function requireLogin(req, res, next) {
  if (req.session.userId) next();
  else res.redirect('/login');
}

// --- Rotas de Login ---
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { error: req.session.error || null });
  req.session.error = null;
});

app.post('/login', async (req, res) => {
  const { login, senha } = req.body;
  try {
    const result = await client.query(
      'SELECT * FROM usuarios WHERE login = $1 AND senha = $2',
      [login, senha]
    );
    if (result.rows.length > 0) {
      req.session.userId = result.rows[0].id;
      req.session.userName = result.rows[0].nome;
      res.redirect('/menu');
    } else {
      req.session.error = 'Login ou senha inválidos.';
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.send('Erro ao logar');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// --- Menu ---
app.get('/menu', requireLogin, (req, res) => {
  res.render('menu', { userName: req.session.userName });
});

// --- Produtos (CRUD) ---
app.get('/produtos', requireLogin, async (req, res) => {
  const result = await client.query('SELECT * FROM produtos ORDER BY idp DESC');
  res.render('produtos', { produtos: result.rows });
});

app.post('/produtos', requireLogin, async (req, res) => {
  const { nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material } = req.body;
  try {
    const insert = `
      INSERT INTO produtos (nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING idp`;
    const result = await client.query(insert, [nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material]);
    await client.query('INSERT INTO saldos (idp, saldo) VALUES ($1, 0)', [result.rows[0].idp]);
    res.redirect('/produtos');
  } catch (err) {
    console.error(err);
    res.send('Erro ao cadastrar produto.');
  }
});

app.get('/produtos/editar/:idp', requireLogin, async (req, res) => {
  const { idp } = req.params;
  const result = await client.query('SELECT * FROM produtos WHERE idp = $1', [idp]);
  res.render('editar_produto', { produto: result.rows[0] });
});

app.post('/produtos/atualizar/:idp', requireLogin, async (req, res) => {
  const { idp } = req.params;
  const { nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material } = req.body;
  await client.query(`
    UPDATE produtos SET nomep=$1, fabricante=$2, preco=$3, especificacoes=$4,
    estoque_minimo=$5, voltagem=$6, cor=$7, peso=$8, material=$9 WHERE idp=$10`,
    [nomep, fabricante, preco, especificacoes, estoque_minimo, voltagem, cor, peso, material, idp]);
  res.redirect('/produtos');
});

app.post('/produtos/excluir/:idp', requireLogin, async (req, res) => {
  const { idp } = req.params;
  await client.query('DELETE FROM produtos WHERE idp=$1', [idp]);
  res.redirect('/produtos');
});

// --- Movimento ---
app.get('/movimento', requireLogin, async (req, res) => {
  const produtos = await client.query('SELECT idp, nomep FROM produtos ORDER BY nomep');
  res.render('movimento', { produtos: produtos.rows });
});

app.post('/movimento', requireLogin, async (req, res) => {
  const { idp, tipo_movimento, qtd } = req.body;
  const tipoM = tipo_movimento === 'ENTRADA' ? 'E' : 'S';
  const quantidade = parseInt(qtd);
  await client.query('BEGIN');
  try {
    if (tipoM === 'S') {
      const saldoRes = await client.query('SELECT saldo FROM saldos WHERE idp=$1 FOR UPDATE', [idp]);
      const saldoAtual = saldoRes.rows[0].saldo;
      if (quantidade > saldoAtual) throw new Error('Saldo insuficiente!');
    }
    await client.query('INSERT INTO movimento (idp, tipom, qtd) VALUES ($1,$2,$3)', [idp, tipoM, quantidade]);
    const op = tipoM === 'E' ? '+' : '-';
    await client.query(`UPDATE saldos SET saldo = saldo ${op} $1 WHERE idp=$2`, [quantidade, idp]);
    await client.query('COMMIT');
    res.redirect('/saldo');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.send('Erro no movimento.');
  }
});

// --- Saldo ---
app.get('/saldo', requireLogin, async (req, res) => {

  try {
    const query = `
      SELECT p.idp, p.nomep, s.saldo, p.estoque_minimo
      FROM produtos p
      JOIN saldos s ON p.idp = s.idp
      ORDER BY p.nomep
    `;
    const result = await client.query(query);
    
    res.render('saldo', { saldos: result.rows });
  } catch (err) {
    console.error("ERRO:", err);
    res.status(500).send("Erro ao carregar saldo.");
  }
});

// --- Servidor ---
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
