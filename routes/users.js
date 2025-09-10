const express = require('express');
const router = express.Router();

// GET /api/user - Получение пользователя
router.get('/', (req, res) => {
  res.json({name: 'Алмаз'});
});

module.exports = router;