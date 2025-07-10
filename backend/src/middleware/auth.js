import AuthService from "@services/auth.service.js";
import { logger } from "@utils/common.js";
import { createErrorResponse } from "@utils/response.js";


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader) {
      const user = AuthService.getUserFromToken(authHeader);
      if (user) {
        req.context = { user };
      } else {
        logger.info('Unauthorized user req')
        throw createErrorResponse(401, 'No Authorized user found')
      }
    } else {
      logger.info('Authorized Token not present')
      throw createErrorResponse(401, 'No Auth token provided')
    }
    next();
}

export default authMiddleware;