const db = require('../database/db');

class Category {
  static getAll(callback) {
    db.all(
      `
            SELECT c.*,
                   (SELECT COUNT(*) FROM bookmarks WHERE category_id = c.id) as bookmarks
            FROM categories c
            ORDER BY c.name
        `,
      callback
    );
  }

  static getById(id, callback) {
    db.get('SELECT * FROM categories WHERE id = ?', [id], callback);
  }

  static create(name, alias, callback) {
    db.run(
      'INSERT INTO categories (name, alias) VALUES (?, ?)',
      [name, alias],
      function (err) {
        callback(err, { id: this.lastID, name, alias, bookmarks: null });
      }
    );
  }

  static update(id, name, alias, callback) {
    db.run(
      'UPDATE categories SET name = ?, alias = ? WHERE id = ?',
      [name, alias, id],
      function (err) {
        callback(err, this.changes);
      }
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Category;
