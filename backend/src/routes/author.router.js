import AuthorService from '@services/authors.service.js';
import { logger } from '@utils/common.js';
import { createErrorResponse } from '@utils/response.js';
import express from 'express';

const authorRouter = express.Router()


// POST /api/author
authorRouter.post('/', async (req, res) => {
    try {
        const { name, biography, born_date } = req.body;
        logger.info(`create author request: ${{name, biography, born_date}}`)
        const { context } = req;
        if (!name) {
            return createErrorResponse(400, { error: 'Name is required' });
        }
        const author = await AuthorService.createAuthor(
            context, { name, biography, born_date }
        );
        res.status(200).json(author);
    } catch (err) {
        console.log(err)
        logger.error('Failed to create author', err)
        throw createErrorResponse(500, { error: err.message });
    }
});

export default authorRouter;