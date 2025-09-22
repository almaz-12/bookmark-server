const express = require('express');
const router = express.Router();

// POST /api/login - Получение токена
router.post('/', (req, res) => {
  // только для учебного проекта
  res.json({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzQ1Njc4MDAsImV4cCI6MTczNDU3MTQwMH0.7V4J8xY6qZz3Q2kL1pR9wTbN0sM7XcA5hG2jKl3P6oE',
  });
});

module.exports = router;
