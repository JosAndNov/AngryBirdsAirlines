const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vuelo = sequelize.define('Vuelo', {
  origen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaSalida: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horaSalida: {
    type: DataTypes.TIME, 
    allowNull: false
  },
  duracion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'vuelos',
  timestamps: true
});

module.exports = Vuelo;
