const express = require('express');
const router = express.Router();
const db = require('../db'); // Our SQLite database connection
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // For deleting files

// --- Multer Configuration for Image Uploads ---
// Ensure the 'uploads' directory exists
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Create a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB file size limit
    }
});

// --- API Endpoints ---

// POST /api/items - Add a new item with image uploads
router.post('/', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
]), (req, res) => {
    const { name, type, description } = req.body;

    if (!name || !type || !description) {
        return res.status(400).json({ message: 'Missing required item fields.' });
    }

    const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].path : null;
    const additionalImages = req.files['additionalImages'] ?
        req.files['additionalImages'].map(file => file.path) : [];

    if (!coverImage) {
        return res.status(400).json({ message: 'Cover image is required.' });
    }

    const insertStmt = db.prepare(
        `INSERT INTO items (name, type, description, coverImage, additionalImages)
         VALUES (?, ?, ?, ?, ?)`
    );

    insertStmt.run(name, type, description, coverImage, JSON.stringify(additionalImages), function(err) {
        if (err) {
            console.error('Error inserting item:', err.message);
            // If error, try to clean up uploaded files
            if (coverImage) fs.unlink(coverImage, (unlinkErr) => unlinkErr && console.error("Error deleting cover image:", unlinkErr));
            additionalImages.forEach(img => fs.unlink(img, (unlinkErr) => unlinkErr && console.error("Error deleting additional image:", unlinkErr)));
            return res.status(500).json({ message: 'Failed to add item.', error: err.message });
        }
        res.status(201).json({
            message: 'Item successfully added',
            itemId: this.lastID,
            item: {
                id: this.lastID,
                name,
                type,
                description,
                coverImage,
                additionalImages
            }
        });
    });
    insertStmt.finalize();
});

// GET /api/items - Get all items (show name and cover image)
router.get('/', (req, res) => {
    db.all("SELECT id, name, type, description, coverImage, additionalImages FROM items", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve items.', error: err.message });
        }
        // Parse additionalImages JSON string back to array
        const items = rows.map(row => ({
            ...row,
            additionalImages: row.additionalImages ? JSON.parse(row.additionalImages) : []
        }));
        res.json(items);
    });
});

// GET /api/items/:id - Get a single item by ID with all details
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve item.', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Item not found.' });
        }
        // Parse additionalImages JSON string back to array
        const item = {
            ...row,
            additionalImages: row.additionalImages ? JSON.parse(row.additionalImages) : []
        };
        res.json(item);
    });
});

// PUT /api/items/:id - Update an existing item (including description)
router.put('/:id', upload.fields([ // Still need multer for potential image updates
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
]), (req, res) => {
    const { id } = req.params;
    const { name, type, description } = req.body;

    // Fetch existing item to check for old images if new ones are uploaded
    db.get("SELECT coverImage, additionalImages FROM items WHERE id = ?", [id], (err, existingItem) => {
        if (err) {
            console.error('Error fetching existing item:', err.message);
            return res.status(500).json({ message: 'Failed to update item.', error: err.message });
        }
        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        let coverImage = req.files && req.files['coverImage'] ? req.files['coverImage'][0].path : existingItem.coverImage;
        let additionalImages = req.files && req.files['additionalImages'] ?
            req.files['additionalImages'].map(file => file.path) : JSON.parse(existingItem.additionalImages || '[]');

        // SQL for update - conditionally update fields
        const updateFields = [];
        const updateValues = [];

        if (name !== undefined) { updateFields.push('name = ?'); updateValues.push(name); }
        if (type !== undefined) { updateFields.push('type = ?'); updateValues.push(type); }
        if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }
        // If a new cover image was uploaded, update path. Else, keep existing.
        if (req.files && req.files['coverImage']) {
            updateFields.push('coverImage = ?'); updateValues.push(coverImage);
            // Delete old cover image if it's different and not a default seeded image
            if (existingItem.coverImage && existingItem.coverImage !== coverImage && !existingItem.coverImage.startsWith('uploads/default_')) {
                fs.unlink(existingItem.coverImage, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting old cover image:", unlinkErr);
                });
            }
        }
        // If new additional images were uploaded, update paths. Else, keep existing.
        if (req.files && req.files['additionalImages']) {
            updateFields.push('additionalImages = ?'); updateValues.push(JSON.stringify(additionalImages));
            // Delete old additional images (if they are not default seeded images)
            const oldAdditionalImages = JSON.parse(existingItem.additionalImages || '[]');
            oldAdditionalImages.forEach(oldImg => {
                 if (!additionalImages.includes(oldImg) && !oldImg.startsWith('uploads/default_')) {
                    fs.unlink(oldImg, (unlinkErr) => {
                        if (unlinkErr) console.error("Error deleting old additional image:", unlinkErr);
                    });
                }
            });
        }


        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update.' });
        }

        const query = `UPDATE items SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(id); // Add ID to the end for the WHERE clause

        db.run(query, updateValues, function(updateErr) {
            if (updateErr) {
                console.error('Error updating item:', updateErr.message);
                // Clean up newly uploaded files if the DB update fails
                if (req.files && req.files['coverImage']) fs.unlink(coverImage, (unlinkErr) => unlinkErr && console.error("Error deleting new cover image:", unlinkErr));
                if (req.files && req.files['additionalImages']) additionalImages.forEach(img => fs.unlink(img, (unlinkErr) => unlinkErr && console.error("Error deleting new additional image:", unlinkErr)));

                return res.status(500).json({ message: 'Failed to update item.', error: updateErr.message });
            }
            if (this.changes === 0) {
                 return res.status(404).json({ message: 'Item not found for update.' });
            }
            res.json({ message: 'Item successfully updated', itemId: id });
        });
    });
});

// DELETE /api/items/:id - Delete an item and its associated images
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // 1. Fetch item to get image paths
    db.get("SELECT coverImage, additionalImages FROM items WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error('Error fetching item for deletion:', err.message);
            return res.status(500).json({ message: 'Failed to delete item.', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        const imagesToDelete = [];
        if (row.coverImage && !row.coverImage.startsWith('uploads/default_')) {
            imagesToDelete.push(row.coverImage);
        }
        if (row.additionalImages) {
            const additional = JSON.parse(row.additionalImages);
            additional.forEach(imgPath => {
                if (!imgPath.startsWith('uploads/default_')) {
                    imagesToDelete.push(imgPath);
                }
            });
        }

        // 2. Delete item from database
        db.run("DELETE FROM items WHERE id = ?", [id], function(deleteErr) {
            if (deleteErr) {
                console.error('Error deleting item from DB:', deleteErr.message);
                return res.status(500).json({ message: 'Failed to delete item from database.', error: deleteErr.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Item not found for deletion in database.' });
            }

            // 3. Delete associated files from filesystem (best effort, don't block response)
            imagesToDelete.forEach(imgPath => {
                fs.unlink(imgPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error deleting image file ${imgPath}:`, unlinkErr);
                        // Log the error but don't prevent response as DB deletion was successful
                    } else {
                        console.log(`Successfully deleted image file: ${imgPath}`);
                    }
                });
            });

            res.json({ message: 'Item and associated images successfully deleted.', itemId: id });
        });
    });
});

module.exports = router;