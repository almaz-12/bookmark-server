const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// GET /api/categories/:categoryId/bookmarks - Получение закладок с фильтрами
router.get('/:categoryId/bookmarks', (req, res) => {
    const { categoryId } = req.params;
    const { title, date } = req.query;

    const filters = {};
    if (title) filters.title = title;
    if (date) filters.date = date;

    Bookmark.getByCategory(categoryId, filters, (err, bookmarks) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(bookmarks);
    });
});

// POST /api/categories/:categoryId/bookmarks - Создание закладки
router.post('/:categoryId/bookmarks', (req, res) => {
    const { categoryId } = req.params;
    const { url, title, description } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    Bookmark.create(categoryId, url, title, description, (err, bookmark) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(bookmark);
    });
});

// DELETE /api/bookmarks/:id - Удаление закладки
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Bookmark.delete(id, (err, changes) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    });
});

module.exports = router;