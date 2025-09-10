const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - Получение всех категорий
router.get('/', (req, res) => {
    Category.getAll((err, categories) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(categories);
    });
});

// POST /api/categories - Создание категории
router.post('/', (req, res) => {
    const { name, alias } = req.body;

    if (!name || !alias) {
        return res.status(400).json({ error: 'Name and alias are required' });
    }

    Category.create(name, alias, (err, category) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json(category);
    });
});

// PUT /api/categories/:id - Обновление категории
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, alias } = req.body;

    if (!name || !alias) {
        return res.status(400).json({ error: 'Name and alias are required' });
    }

    Category.update(id, name, alias, (err, changes) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully' });
    });
});

// DELETE /api/categories/:id - Удаление категории
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Category.delete(id, (err, changes) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (changes === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});

module.exports = router;