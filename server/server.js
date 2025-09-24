const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database.js');
const ExpressWaf = require('express-waf');

const app = express();

// --- Configuração do WAF ---
const waf = new ExpressWaf({
    blocker: {
        db: new ExpressWaf.EmulatedDB(), // Para simplicidade, usa um banco em memória
        blockTime: 60 * 1000 // Bloqueia por 1 minuto
    },
    log: true // Loga os ataques no console
});

// Adiciona módulos de proteção
waf.addModule('sql-module', {}, (error) => console.log(error));
waf.addModule('xss-module', {}, (error) => console.log(error));

// Adiciona o WAF como primeiro middleware
app.use(waf.check);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
// O '..' é necessário porque estamos dentro da pasta /server
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));

// Rota de teste da API
app.get('/api', (req, res) => {
    res.json({ message: "Olá! A API está funcionando." });
});

// --- API para "Nossos Planos" ---

// GET: Buscar todos os planos
app.get('/api/plans', (req, res) => {
    const sql = "SELECT * FROM plans ORDER BY sortOrder ASC, id DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Converte a string JSON de subtarefas de volta para um array
        const plans = rows.map(plan => ({
            ...plan,
            completed: !!plan.completed,
            subtasks: plan.subtasks ? JSON.parse(plan.subtasks) : []
        }));
        res.json({
            "message": "success",
            "data": plans
        });
    });
});

// DELETE: Deletar um lançamento financeiro
app.delete('/api/finances/:id', (req, res) => {
    const sql = 'DELETE FROM finances WHERE id = ?';
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});

// POST: Criar um novo plano
app.post('/api/plans', (req, res) => {
    const { text, completed, targetDate, subtasks } = req.body;
    // Pega a maior ordem de sortOrder e adiciona 1
    const getOrderSql = "SELECT MAX(sortOrder) as maxOrder FROM plans";
    db.get(getOrderSql, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const newOrder = (row.maxOrder || 0) + 1;
        const sql = 'INSERT INTO plans (text, completed, targetDate, subtasks, sortOrder) VALUES (?, ?, ?, ?, ?)';
        const params = [text, completed ? 1 : 0, targetDate, JSON.stringify(subtasks || []), newOrder];

        db.run(sql, params, function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.status(201).json({
                "message": "success",
                "data": { id: this.lastID, text, completed, targetDate, subtasks: subtasks || [], sortOrder: newOrder },
            });
        });
    });
});

// PUT: Atualizar um plano
app.put('/api/plans/:id', (req, res) => {
    const { text, completed, targetDate, subtasks, sortOrder } = req.body;
    const sql = `UPDATE plans set
                 text = COALESCE(?, text),
                 completed = COALESCE(?, completed),
                 targetDate = COALESCE(?, targetDate),
                 subtasks = COALESCE(?, subtasks),
                 sortOrder = COALESCE(?, sortOrder)
                 WHERE id = ?`;
    const params = [
        text,
        completed === undefined ? undefined : (completed ? 1 : 0),
        targetDate,
        subtasks === undefined ? undefined : JSON.stringify(subtasks),
        sortOrder,
        req.params.id
    ];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            changes: this.changes
        });
    });
});

// DELETE: Deletar um plano
app.delete('/api/plans/:id', (req, res) => {
    const sql = 'DELETE FROM plans WHERE id = ?';
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", changes: this.changes });
    });
});


// Rota principal para servir o index.html para a SPA
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// --- API para Finanças (Bujo) ---

// GET: Buscar todos os lançamentos financeiros
app.get('/api/finances', (req, res) => {
    const sql = "SELECT * FROM finances ORDER BY date DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// POST: Adicionar um novo lançamento financeiro
app.post('/api/finances', (req, res) => {
    const { description, amount, type, date } = req.body;
    const sql = 'INSERT INTO finances (description, amount, type, date) VALUES (?, ?, ?, ?)';
    const params = [description, amount, type, date];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(201).json({
            "message": "success",
            "data": { id: this.lastID, ...req.body },
        });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Manter o processo rodando
process.on('SIGINT', () => {
  console.log('Servidor encerrado.');
  process.exit();
});