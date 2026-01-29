const express = require('express');
const router = express.Router();
const sql = require('../db');
const generateId = require('../utils/generateId');

router.post('/', async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'content is required and must be a non-empty string' });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: 'ttl_seconds must be integer >= 1' });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: 'max_views must be integer >= 1' });
  }

  let id;
  do {
    id = generateId();
  } while ((await sql`SELECT 1 FROM pastes WHERE id = ${id}`).length > 0);

  const expires_at = ttl_seconds ? new Date(Date.now() + ttl_seconds * 1000) : null;

  await sql`
    INSERT INTO pastes (id, content, expires_at, max_views, views)
    VALUES (${id}, ${content.trim()}, ${expires_at}, ${max_views ?? null}, 0)
  `;

  const base = process.env.BASE_URL || 'http://localhost:5173';
  const url = `${base}/p/${id}`;

  res.status(201).json({ id, url });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  let now = new Date();
  if (process.env.TEST_MODE === '1') {
    const testNowMs = req.headers['x-test-now-ms'];
    if (testNowMs && !isNaN(testNowMs)) {
      now = new Date(Number(testNowMs));
    }
  }

  try {
    const rows = await sql`SELECT * FROM pastes WHERE id = ${id}`;
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Paste expired or not found' });
    }

    const paste = rows[0];

    if (paste.expires_at && now > new Date(paste.expires_at)) {
      await sql`DELETE FROM pastes WHERE id = ${id}`;
      return res.status(404).json({ error: 'Paste expired or not found' });
    }

    if (paste.max_views && paste.views >= paste.max_views) {
      await sql`DELETE FROM pastes WHERE id = ${id}`;
      return res.status(404).json({ error: 'Paste expired or not found' });
    }

    await sql`UPDATE pastes SET views = views + 1 WHERE id = ${id}`;

    const updatedRows = await sql`SELECT * FROM pastes WHERE id = ${id}`;
    const updated = updatedRows[0];

    res.json({
      content: updated.content,
      remaining_views: updated.max_views !== null ? updated.max_views - updated.views : null,
      expires_at: updated.expires_at ? new Date(updated.expires_at).toISOString() : null,
    });
  } catch (err) {
    console.error('Error in GET /api/pastes/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;