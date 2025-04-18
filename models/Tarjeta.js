const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tarjeta = sequelize.define('Tarjeta', {
  numero: {
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      len: [16, 16]
    }
  },
  vencimiento: {
    type: DataTypes.STRING(5), // formato MM/YY
    allowNull: false,
    validate: {
      is: /^\d{2}\/\d{2}$/
    }
  },
  cvv: {
    type: DataTypes.STRING(3),
    allowNull: false,
    validate: {
      len: [3, 3],
      isNumeric: true
    }
  },
  codigoReserva: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'reservas',
      key: 'codigoReserva'
    }
  }
}, {
  tableName: 'tarjetas'
});

module.exports = Tarjeta;
