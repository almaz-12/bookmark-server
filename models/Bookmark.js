const db = require('../database/db');

class Bookmark {
  static getByCategory(categoryId, filters = {}, callback) {
    let query = `
        SELECT b.*
        FROM bookmarks b
        WHERE b.category_id = ?
    `;
    let params = [categoryId];

    // Определяем поле и направление сортировки
    let sortField = 'created_at'; // поле по умолчанию
    let sortOrder = 'DESC'; // направление по умолчанию

    if (filters.sortBy) {
      // Разрешенные поля для сортировки (для безопасности)
      const allowedFields = ['title', 'created_at', 'updated_at', 'id'];
      if (allowedFields.includes(filters.sortBy)) {
        sortField = filters.sortBy;
      }
    }

    if (filters.sortOrder) {
      // Проверяем допустимые направления сортировки
      if (
        filters.sortOrder.toUpperCase() === 'ASC' ||
        filters.sortOrder.toUpperCase() === 'DESC'
      ) {
        sortOrder = filters.sortOrder.toUpperCase();
      }
    }

    query += ` ORDER BY b.${sortField} ${sortOrder}`;

    db.all(query, params, callback);
  }

  static create(
    categoryId,
    url,
    title = '',
    description = '',
    image = '',
    callback
  ) {
    db.run(
      'INSERT INTO bookmarks (category_id, url, title, description, image) VALUES (?, ?, ?, ?, ?)',
      [categoryId, url, title, description, image],
      function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          id: this.lastID, // теперь this будет правильным
          category_id: categoryId,
          url,
          title,
          description,
          image,
        });
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM bookmarks WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Bookmark;
