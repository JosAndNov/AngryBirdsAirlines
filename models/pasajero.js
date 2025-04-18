const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pasajero = sequelize.define('Pasajero', {
  codigoReserva:{
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'pasajeros',
  timestamps: true
});

module.exports = Pasajero;
