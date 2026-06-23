// Simple Express server with MySQL connection
require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sequelize (MySQL) setup
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ;
const DB_NAME = process.env.DB_NAME ;
const DB_USER = process.env.DB_USER ;
const DB_PASS = process.env.DB_PASSWORD;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

// Define Person model (id, name)
const Person = sequelize.define('Person', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'people',
  timestamps: false,
});

// Initialize DB: sync model and seed two rows if empty
async function initDb() {
  await sequelize.authenticate();
  await Person.sync();
  const count = await Person.count();
  if (count === 0) {
    await Person.bulkCreate([{ name: 'Alice' }, { name: 'Bob' }]);
    console.log('Seeded people table with Alice and Bob');
  }
}

app.get('/', async (_req, res) => {
  let dbStatus = 'unknown';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.json({
    message: 'Hello from node-docker-testing (MySQL + Sequelize)!',
    environment: process.env.NODE_ENV || 'development',
    port: port,
    db: dbStatus,
  });
});

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// GET /all -> return all rows from people
app.get('/all', async (_req, res) => {
  try {
    const rows = await Person.findAll({ attributes: ['id', 'name'], order: [['id', 'ASC']] });
    res.json({ rows });
  } catch (err) {
    console.error('Error reading people:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /insert -> insert a single person { name: '...' }
app.post('/insert', async (req, res) => {
  const name = req.body && req.body.name ? String(req.body.name).trim() : '';
  if (!name) return res.status(400).json({ error: 'name is required' });

  try {
    const person = await Person.create({ name });
    res.status(201).json({ id: person.id, name: person.name });
  } catch (err) {
    console.error('Error inserting person:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start server after initializing DB
(async function start() {
  try {
    await initDb();
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();
