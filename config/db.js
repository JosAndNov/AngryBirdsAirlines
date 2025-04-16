const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,     // nombre de la base de datos
  process.env.DB_USER,     // usuario de postgres
  process.env.DB_PASSWORD, // contraseña de postgres
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432
  }
);

module.exports = sequelize;