const Usuario = require('./Usuario');
const Vuelo = require('./Vuelo');
const Reserva = require('./Reserva');
const Promocion = require('./Promocion');
const Notificacion = require('./Notificacion');
const Pasajero = require('./Pasajero');
const Tarjeta = require('./Tarjeta'); // ✅ FALTA ESTA LÍNEA


// 🧑‍💼 Usuario tiene muchas Reservas
Usuario.hasMany(Reserva, { foreignKey: 'UsuarioId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'UsuarioId', as: 'usuario' });

// ✈️ Vuelo tiene muchas Reservas
Vuelo.hasMany(Reserva, { foreignKey: 'VueloId', as: 'reservas' });
Reserva.belongsTo(Vuelo, { foreignKey: 'VueloId', as: 'vuelo' });

// 🔔 Usuario tiene muchas Notificaciones
Usuario.hasMany(Notificacion, { foreignKey: 'UsuarioId', as: 'notificaciones' });
Notificacion.belongsTo(Usuario, { foreignKey: 'UsuarioId', as: 'usuario' });

// 🎟️ Reserva tiene muchos Pasajeros
// Reserva tiene muchos Pasajeros (usando códigoReserva)
Reserva.hasMany(Pasajero, { foreignKey: 'codigoReserva', sourceKey: 'codigoReserva', as: 'pasajeros' });
Pasajero.belongsTo(Reserva, { foreignKey: 'codigoReserva', targetKey: 'codigoReserva', as: 'reserva' });

// ✈️ Vuelo tiene muchos Pasajeros
Vuelo.hasMany(Pasajero, { foreignKey: 'VueloId', as: 'pasajeros' });
Pasajero.belongsTo(Vuelo, { foreignKey: 'VueloId', as: 'vuelo' });

// 🎁 Vuelo tiene una Promoción
Vuelo.hasOne(Promocion, { foreignKey: 'vueloId', as: 'promocion' });
Promocion.belongsTo(Vuelo, { foreignKey: 'vueloId', as: 'vuelo' });

Reserva.hasOne(Tarjeta, { foreignKey: 'codigoReserva', sourceKey: 'codigoReserva', as: 'tarjeta'});
Tarjeta.belongsTo(Reserva, { foreignKey: 'codigoReserva', targetKey: 'codigoReserva', as: 'reserva'});

module.exports = {
  Usuario,
  Vuelo,
  Reserva,
  Promocion,
  Notificacion,
  Pasajero,
  Tarjeta
};


