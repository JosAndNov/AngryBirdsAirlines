const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Promocion = sequelize.define('Promocion', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  porcentaje: {
    type: DataTypes.INTEGER, // Ej: 10 = 10% de descuento
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'promociones',
  timestamps: true
});

module.exports = Promocion;
