const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "database.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        const createPlansTable = `
            CREATE TABLE IF NOT EXISTS plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0,
                targetDate TEXT,
                subtasks TEXT,
                sortOrder INTEGER
            );
        `;

        db.run(createPlansTable, (err) => {
            if (err) {
                // Table already created or error, try to add new columns
                console.log('Tabela "plans" já existe ou erro na criação. Verificando colunas...');
                const columns = ['targetDate TEXT', 'subtasks TEXT', 'sortOrder INTEGER'];
                columns.forEach(column => {
                    const [name, type] = column.split(' ');
                    db.run(`ALTER TABLE plans ADD COLUMN ${name} ${type}`, (err) => {
                        if (err && err.message.includes('duplicate column name')) {
                            // Column already exists
                        } else if (err) {
                            console.error(`Erro ao adicionar coluna ${name}:`, err.message);
                        }
                    });
                });

            } else {
                console.log('Tabela "plans" criada com sucesso.');
                // Adicionar dados de exemplo (opcional)
                const insert = 'INSERT INTO plans (text, completed, subtasks, sortOrder) VALUES (?,?,?,?)';
                db.run(insert, ["Conquistar o mundo", false, "[]", 0]);
                db.run(insert, ["Aprender a cozinhar", true, "[]", 1]);
            }
        });

        const createFinancesTable = `
            CREATE TABLE IF NOT EXISTS finances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT NOT NULL,
                amount REAL NOT NULL,
                type TEXT NOT NULL,
                date TEXT NOT NULL
            );
        `;

        db.run(createFinancesTable, (err) => {
            if (err) {
                console.log('Tabela "finances" já existe.');
            } else {
                console.log('Tabela "finances" criada com sucesso.');
            }
        });
    }
});

module.exports = db;