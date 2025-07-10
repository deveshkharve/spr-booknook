import express from 'express';
import AuthService from '@services/auth.service.js';
import { createErrorResponse } from '@utils/response.js';
import { logger } from '@utils/common.js';

const authRouter = express.Router();


// POST /api/signup
authRouter.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    logger.info(`Signinup request with username: ${username}`);

    if (!username || !email || !password) {
      return createErrorResponse(400, { error: 'Username, email, and password are required' });
    }
    const { user, token } = await AuthService.signup({ username, email, password });
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    logger.error(`Error occurred while signinup ${err}`)
    res.status(400).json({ error: err.message });
  }
});

// POST /api/login
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.info('Username or password missing');
      throw new Error('Username/email and password are required');
    }
    const { user, token } = await AuthService.login({ usernameOrEmail: username, password });
    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    logger.error(`Error occurred while signinup ${err}`)
    throw createErrorResponse(400, { error: err.message });
  }
});


export default authRouter;