const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const { Reserva, Vuelo, Pasajero, Tarjeta } = require('../models');
const enviarCorreo = require('../utils/correo');



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
router.delete('/cancelar/:codigoReserva', verificarToken, async (req, res) => {
  const { codigoReserva } = req.params;

  try {
    const reserva = await Reserva.findOne({
      where: { codigoReserva },
      include: {
        model: Vuelo,
        as: 'vuelo'
      }
    });

    if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    const vuelo = reserva.vuelo;

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

    // 🟢 Enviar respuesta primero
    res.status(200).json({
      mensaje: 'Reserva cancelada con éxito',
      reembolso,
      total: reserva.total,
      ultimos4
    });

    // 📧 Enviar correo después
    await enviarCorreo(
      reserva.correoReserva,
      '❌ Cancelación de reserva - Angry Birds Airlines',
      `
        <h2>❌ Reserva cancelada</h2>
        <p><strong>Reserva:</strong> ${reserva.codigoReserva}</p>
        <p><strong>Vuelo:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
        <p><strong>Fecha:</strong> ${vuelo.fechaSalida} a las ${vuelo.horaSalida}</p>
        <p><strong>Total pagado:</strong> $${reserva.total}</p>
        <p><strong>Reembolso (75%):</strong> $${reembolso}</p>
        <p>💳 Se devolverá a la tarjeta terminada en <strong>${ultimos4}</strong></p>
        <hr>
        <p>Gracias por confiar en Angry Birds Airlines 🐦</p>
      `
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
  }
});


// ✏️ Modificar reserva (pasajeros y correo)
router.put('/modificar/:codigoReserva', verificarToken, async (req, res) => {
  const { codigoReserva } = req.params;
  const { pasajeros, correoReserva } = req.body;

  try {
    const reserva = await Reserva.findOne({
      where: { codigoReserva },
      include: { model: Vuelo, as: 'vuelo' }
    });

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    const vuelo = reserva.vuelo;
    const vueloFecha = new Date(`${vuelo.fechaSalida}T${vuelo.horaSalida}`);
    const ahora = new Date();
    const diferenciaHoras = (vueloFecha - ahora) / 1000 / 3600;

    if (diferenciaHoras < 48) {
      return res.status(400).json({ mensaje: '⛔ No se puede modificar la reserva con menos de 48 horas de anticipación' });
    }

    // Actualizar pasajeros
    for (const p of pasajeros) {
      await Pasajero.update(
        { nombre: p.nombre, apellido: p.apellido, documento: p.documento },
        { where: { id: p.id } }
      );
    }

    if (correoReserva && correoReserva !== reserva.correoReserva) {
      reserva.correoReserva = correoReserva;
    }

    reserva.titularReserva = `${pasajeros[0].nombre} ${pasajeros[0].apellido}`;
    await reserva.save();

    // ✅ Enviar la respuesta al cliente inmediatamente
    res.status(200).json({
      mensaje: 'Reserva modificada correctamente',
      nuevoTitular: reserva.titularReserva,
      nuevoCorreo: reserva.correoReserva
    });

    // 📬 Enviar correo en segundo plano (no bloqueante)
    const htmlCorreo = `
      <h2>✏️ Tu reserva ha sido modificada</h2>
      <p><strong>Código de Reserva:</strong> ${reserva.codigoReserva}</p>
      <p><strong>Vuelo:</strong> ${vuelo.origen} → ${vuelo.destino}</p>
      <p><strong>Fecha:</strong> ${vuelo.fechaSalida} a las ${vuelo.horaSalida}</p>
      <p><strong>Nuevo titular:</strong> ${reserva.titularReserva}</p>
      <p><strong>Nuevo correo:</strong> ${reserva.correoReserva}</p>
      <hr>
      <p><strong>Pasajeros actualizados:</strong></p>
      <ul>
        ${pasajeros.map(p => `<li>${p.nombre} ${p.apellido} - ${p.documento}</li>`).join('')}
      </ul>
      <p>🛫 ¡Gracias por actualizar tu información!</p>
    `;

    // Enviar correo después, sin esperar su resultado
    enviarCorreo(reserva.correoReserva, '✏️ Modificación de reserva - Angry Birds Airlines', htmlCorreo)
      .then(() => console.log('✅ Correo de modificación enviado'))
      .catch(err => console.error('❌ Error al enviar correo de modificación:', err));

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al modificar la reserva' });
  }
});



// 🔍 Obtener detalle de reserva para modificar
router.get('/detalle/:codigoReserva', verificarToken, async (req, res) => {
  const { codigoReserva } = req.params;

  try {
    const reserva = await Reserva.findOne({
      where: { codigoReserva },
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

    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    res.status(200).json({ reserva });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cargar la reserva' });
  }
});



module.exports = router;
