const Usuario = require('./Usuario');
const Vuelo = require('./Vuelo');
const Reserva = require('./Reserva');
const Promocion = require('./Promocion');
const Notificacion = require('./Notificacion');

// Relación: Usuario tiene muchas Reservas
Usuario.hasMany(Reserva);
Reserva.belongsTo(Usuario);

// Relación: Vuelo tiene muchas Reservas
Vuelo.hasMany(Reserva);
Reserva.belongsTo(Vuelo);

// Relación: Usuario tiene muchas Notificaciones
Usuario.hasMany(Notificacion);
Notificacion.belongsTo(Usuario);

// Relación: Vuelo tiene una Promoción
Vuelo.hasOne(Promocion, { foreignKey: 'vueloId' });
Promocion.belongsTo(Vuelo, { foreignKey: 'vueloId' });

module.exports = {
  Usuario,
  Vuelo,
  Reserva,
  Promocion,
  Notificacion
};