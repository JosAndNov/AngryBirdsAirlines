const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { Reserva, Vuelo, Pasajero, Tarjeta } = require('../models');


// 🔐 Obtener reservas activas del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const reservas = await Reserva.findAll({
      where: { UsuarioId: usuarioId, estado: 'activo' },
      include: [
        {
          model: Vuelo,
          as: 'vuelo'
        },
        {
          model: Pasajero,
          as: 'pasajeros'
        }
      ]
    });

    res.status(200).json({ reservas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cargar reservas' });
  }
});

// Cancelar reserva
// Cancelar reserva
router.delete('/cancelar/:codigoReserva', verificarToken, async (req, res) => {
  const { codigoReserva } = req.params;

  try {
    const reserva = await Reserva.findOne({ where: { codigoReserva } });

    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    const vuelo = await Vuelo.findByPk(reserva.VueloId);

    const vueloFecha = new Date(`${vuelo.fechaSalida}T${vuelo.horaSalida}`);
    const ahora = new Date();
    const diferenciaHoras = (vueloFecha - ahora) / 1000 / 3600;

    if (diferenciaHoras < 48) {
      return res.status(400).json({ mensaje: '⛔ No se puede cancelar la reserva con menos de 48 horas de anticipación' });
    }

    // Cambiar estado
    reserva.estado = 'cancelada';
    await reserva.save();

    // Eliminar pasajeros para liberar cupos
    await Pasajero.destroy({ where: { codigoReserva } });

    // Obtener últimos 4 dígitos de la tarjeta
    const tarjeta = await Tarjeta.findOne({ where: { codigoReserva } });
    const ultimos4 = tarjeta ? tarjeta.numero.slice(-4) : '****';

    const reembolso = Math.round(reserva.total * 0.75);

    res.status(200).json({
      mensaje: 'Reserva cancelada con éxito',
      reembolso,
      total: reserva.total,
      ultimos4
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
  }
});

module.exports = router;
