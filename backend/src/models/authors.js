import { DataTypes } from 'sequelize';
import sequelize from '@models/db/postgresProvider.js';

const Author = sequelize.define('Author', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
  },
  born_date: {
    type: DataTypes.DATEONLY,
  },
  created_by: {
    type: DataTypes.JSONB
  },
});

export default Author;
