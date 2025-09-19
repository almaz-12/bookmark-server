const db = require('../database/db');

class Bookmark {
  static getByCategory(categoryId, filters = {}, callback) {
    let query = `
            SELECT b.*
            FROM bookmarks b
            WHERE b.category_id = ?
        `;
    let params = [categoryId];

    if (filters.title) {
      query += ' AND b.title LIKE ?';
      params.push(`%${filters.title}%`);
    }

    if (filters.date) {
      query += ' AND DATE(b.created_at) = ?';
      params.push(filters.date);
    }

    query += ' ORDER BY b.created_at DESC';

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
