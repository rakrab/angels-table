const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const dbPath = path.join(dbDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create table
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL,
      description TEXT,
      is_internal INTEGER NOT NULL CHECK(is_internal IN (0, 1))
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table "entries" created successfully');
    }
  });

  // Sample data commented out
  // const stmt = db.prepare('INSERT INTO entries (name, description, is_internal) VALUES (?, ?, ?)');
  // stmt.run('Sample Entry 1', 'This is a sample description for entry 1', 1);
  // stmt.run('Sample Entry 2', 'Another sample description', 0);
  // stmt.run('Sample Entry 3', 'Yet another sample', 1);
  // stmt.finalize();
  // console.log('Sample data inserted');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database initialized successfully at:', dbPath);
  }
});