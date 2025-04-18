const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vuelo = sequelize.define('Vuelo', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
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

Vuelo.beforeCreate(async (vuelo, options) => {
  const ultimoVuelo = await Vuelo.findOne({
    order: [['createdAt', 'DESC']]
  });

  let nuevoNumero = 1;
  if (ultimoVuelo && ultimoVuelo.id) {
    const num = parseInt(ultimoVuelo.id.replace('ABA', ''));
    nuevoNumero = num + 1;
  }

  vuelo.id = `ABA${nuevoNumero.toString().padStart(4, '0')}`;
});

module.exports = Vuelo;
