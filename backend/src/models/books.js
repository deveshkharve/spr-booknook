import { DataTypes } from 'sequelize';
import sequelize from './db/postgresProvider.js';
import Author from './authors.js';

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  published_date: {
    type: DataTypes.DATEONLY,
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Author,
      key: 'id',
    },
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  total_rating_sum: {
    type: DataTypes.INTEGER,
  },
  total_rating_count: {
    type: DataTypes.INTEGER,
  },
  created_by: {
    type: DataTypes.JSONB,
  }
});

Book.belongsTo(Author, { foreignKey: 'author_id' });
Author.hasMany(Book, { foreignKey: 'author_id' });

export default Book;
