const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notificacion = sequelize.define('Notificacion', {
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notificaciones',
  timestamps: true
});

module.exports = Notificacion;
