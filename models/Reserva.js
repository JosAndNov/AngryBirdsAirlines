const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reserva = sequelize.define('Reserva', {
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'activo' // activo, cancelado, cambiado
  }
}, {
  tableName: 'reservas',
  timestamps: true
});

module.exports = Reserva;
