import express from 'express';
import authRouter from '@routes/auth.router.js';
import booksRouter from '@routes/books.router.js';
import authorRouter from '@routes/author.router.js';
import authMiddleware from '@middleware/auth.js';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/books', authMiddleware, booksRouter);

router.use('/authors', authMiddleware, authorRouter);

export default router;

