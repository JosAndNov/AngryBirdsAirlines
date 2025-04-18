const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reserva = sequelize.define('Reserva', {
  codigoReserva: {
    type: DataTypes.STRING,
    primaryKey: true // ✅ ahora será la clave primaria
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'activo'
  },
  titularReserva: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correoReserva: { // Nuevo campo
    type: DataTypes.STRING,
    allowNull: false
  },
  cantidadPasajeros: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correoUsuario: {
    type: DataTypes.STRING,
    allowNull: false
  } 
}, {
  tableName: 'reservas',
  timestamps: true
});

module.exports = Reserva;
