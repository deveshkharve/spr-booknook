import BookService from '@services/books.service.js';
import { ensureDir } from '@utils/common.js';
import { createErrorResponse } from '@utils/response.js';
import { UPLOADS_DIR } from '@configs/index.js';
import express from 'express';
import multer from 'multer';

ensureDir(UPLOADS_DIR)
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // Store file with a temporary name; after upload, we'll calculate checksum and rename to <checksum>.<ext>
        const ext = path.extname(file.originalname);
        const tempName = `${crypto.randomUUID()}${ext}`;
        // Calculate checksum and rename the file
        cb(null, tempName)
    }
});

const upload = multer({ storage });

const booksRouter = express.Router()

// POST /api/addBook
booksRouter.post('/',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
        // Handle form-data: text fields in req.body, files in req.files
        // Expecting: thumbnail (single file), images (array of files)
        const { title, description, published_date, author_id } = req.body;
        const { context } = req;
        // For file uploads, you need to use multer middleware in your route setup.
        // Here, we assume req.files.thumbnail (single file) and req.files.images (array of files)
        let thumbnail = null;
        let images = [];

        if (req.files) {
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                // Save the file path or URL as needed
                thumbnail = req.files.thumbnail[0].path || req.files.thumbnail[0].filename;
            }
            if (req.files.images) {
                images = req.files.images.map(file => file.path || file.filename);
            }
        }

        if (!title || !author_id) {
            return createErrorResponse(400, { error: 'Title and author_id are required' });
        }

        console.log('creating book>>>>>', title, description, published_date, author_id, thumbnail, images)
        // Use BookService.createBook (GraphQL resolver signature: (_, args))
        const book = await BookService.createBook(
            context, { title, description, published_date, author_id, thumbnail, images }
        );
        res.json(book);
});


// PUT /api/book/:id
booksRouter.put('/:id',
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, published_date, author_id } = req.body;

            // Handle file uploads if present
            let thumbnail = null;
            let images = [];

            if (req.files) {
                if (req.files.thumbnail && req.files.thumbnail[0]) {
                    thumbnail = req.files.thumbnail[0].path || req.files.thumbnail[0].filename;
                }
                if (req.files.images) {
                    images = req.files.images.map(file => file.path || file.filename);
                }
            }

            // Only update fields that are provided
            const updateFields = {};
            if (title !== undefined) updateFields.title = title;
            if (description !== undefined) updateFields.description = description;
            if (published_date !== undefined) updateFields.published_date = published_date;
            if (author_id !== undefined) updateFields.author_id = author_id;
            if (thumbnail !== null) updateFields.thumbnail = thumbnail;
            if (images.length > 0) updateFields.images = images;

            if (Object.keys(updateFields).length === 0) {
                return createErrorResponse(400, { error: 'No fields provided for update' });
            }

            // Use BookService.updateBook (GraphQL resolver signature: (_, args))
            const updatedBook = await BookService.updateBook({ id, ...updateFields });
            res.json(updatedBook);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
});


export default booksRouter;