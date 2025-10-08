const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Bookmark = require('../models/Bookmark');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// GET /api/bookmarks/:categoryId/bookmarks - Получение закладок с фильтрами
router.get('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { sortBy, sortOrder } = req.query;

  const filters = {};
  if (sortBy) filters.sortBy = sortBy;
  if (sortOrder) filters.sortOrder = sortOrder;

  Bookmark.getByCategory(categoryId, filters, (err, bookmarks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(bookmarks);
  });
});

// POST /api/bookmarks/:categoryId - Создание закладки
router.post('/:categoryId', upload.single('image'), (req, res) => {
  const { categoryId } = req.params;
  const { url, title, description } = req.body;

  // Путь к загруженному файлу
  console.log(req.file);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

  if (!url && !imagePath) {
    return res.status(400).json({ error: 'Either URL or image is required' });
  }

  Bookmark.create(
    categoryId,
    url,
    title,
    description,
    imagePath,
    (err, bookmark) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json(bookmark);
    }
  );
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
