import Author from "@models/authors.js";
import sequelize from "@models/db/postgresProvider.js";
import { logger } from "@utils/common.js";


const getAuthors = async ({ page, pageSize, name, birthYear }) => {
    const where = {};
    if (name) where.name = { [sequelize.Sequelize.Op.iLike]: `%${name}%` };
    if (birthYear) where.born_date = sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "born_date"')), birthYear);
    const { count, rows } = await Author.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['name', 'ASC']],
    });
    return { authors: rows, total: count };
  }

const getAuthorById = async ({ id }) => Author.findByPk(id)


const createAuthor = async (context, { name, biography, born_date }) => {
  logger.debug('(createAuthor) request context', context)
  const { user } = context;
  return Author.create({ name, biography, born_date, created_by: { id: user.id, username: user.username } })
};


const updateAuthor = async (context, { id, name, biography, born_date }) => {
  logger.debug('(updateAuthor) request context', context)
  const author = await Author.findByPk(id);
  if (!author) throw new Error('Author not found');
  await author.update({ name, biography, born_date });
  return author;
}

const deleteAuthor = async ({ id }) => {
  const deleted = await Author.destroy({ where: { id } });
  return !!deleted;
}

const getAuthorByBook = async (book) => Author.findByPk(book.author_id);

const AuthorService = {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorByBook,
}

export default AuthorService;