const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const DB_PATH = path.resolve(__dirname, 'database.sqlite');

// Connect to the database. If the file doesn't exist, it will be created.
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database at', DB_PATH);
        // Create items table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT NOT NULL,
                coverImage TEXT NOT NULL,
                additionalImages TEXT -- Stored as a JSON string
            )
        `, (createErr) => {
            if (createErr) {
                console.error('Error creating items table:', createErr.message);
            } else {
                console.log('Items table ensured.');
                // Optional: Add some static items for initial testing if the table was just created
                db.get("SELECT COUNT(*) as count FROM items", (err, row) => {
                    if (err) {
                        console.error("Error checking item count:", err.message);
                        return;
                    }
                    if (row.count === 0) {
                        console.log("No items found, seeding initial data...");
                        const insert = db.prepare(`INSERT INTO items (name, type, description, coverImage, additionalImages) VALUES (?, ?, ?, ?, ?)`);
                        insert.run("Stylish T-Shirt", "Shirt", "A comfortable and stylish cotton t-shirt for everyday wear.", "uploads/default_shirt.jpg", JSON.stringify(["uploads/default_shirt_1.jpg", "uploads/default_shirt_2.jpg"]));
                        insert.run("Classic Jeans", "Pant", "Durable denim jeans with a classic fit.", "uploads/default_pant.jpg", JSON.stringify(["uploads/default_pant_1.jpg", "uploads/default_pant_2.jpg"]));
                        insert.run("Running Shoes", "Shoes", "Lightweight running shoes with superior cushioning.", "uploads/default_shoes.jpg", JSON.stringify(["uploads/default_shoes_1.jpg", "uploads/default_shoes_2.jpg"]));
                        insert.finalize(() => {
                            console.log("Initial items seeded.");
                        });
                    }
                });
            }
        });
    }
});

module.exports = db;