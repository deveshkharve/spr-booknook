import { ApolloServer } from '@apollo/server';
import schema from '@graphql/schema/index.js';
import sequelize from '@models/db/postgresProvider.js';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { logger } from '@utils/common.js';
import authMiddleware from '@middleware/auth.js';


async function startGraphQL(app) {
  await sequelize.sync();

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    authMiddleware,
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          user: req.user,
        };
      },
    })
  );

  logger.info(`🚀 GraphQL ready at /graphql`);
}


export default startGraphQL; 