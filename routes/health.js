const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  const info = { server: 'ok', time: new Date().toISOString() };

  // MongoDB status
  try {
    const connState = mongoose.connection.readyState; // 0 disconnected, 1 connected
    info.db = { readyState: connState };
    if (connState === 1 && mongoose.connection.db) {
      try {
        const admin = mongoose.connection.db.admin ? mongoose.connection.db.admin() : null;
        if (admin && typeof admin.ping === 'function') {
          const ping = await admin.ping();
          info.db.ping = ping;
        }
      } catch (err) {
        info.db.pingError = String(err.message || err);
      }
    }
  } catch (err) {
    info.db = { error: String(err.message || err) };
  }

  // OpenAI config check (presence only)
  info.openai = { configured: !!process.env.OPENAI_API_KEY };

  // Upload dir check
  try {
    const fs = require('fs');
    const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
    info.uploadDir = { exists: fs.existsSync(UPLOAD_DIR), path: UPLOAD_DIR };
  } catch (err) {
    info.uploadDir = { error: String(err.message || err) };
  }

  res.json(info);
});

module.exports = router;
