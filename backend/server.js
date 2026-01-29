const express = require('express');
const cors = require('cors');
const pastesRouter = require('./routes/pastes'); // ← plural
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/healthz', async (req, res) => {
  try {
    const sql = require('./db');
    await sql`SELECT 1`;
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(503).json({ ok: false, error: 'Database unavailable' });
  }
});

app.use('/api/pastes', pastesRouter);

// For local dev: serve frontend build if exists
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/dist'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../frontend/dist' });
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});