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

// (Opcional) Relación: Promocion puede pertenecer a muchos usuarios
Promocion.hasMany(Usuario, { foreignKey: 'promocionId' });
Usuario.belongsTo(Promocion, { foreignKey: 'promocionId' });

module.exports = {
  Usuario,
  Vuelo,
  Reserva,
  Promocion,
  Notificacion
};